import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';
import { DIRECTIONS } from 'src/app/shared/contants/directions.constant';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { selectPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { Store } from '@ngrx/store';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { selectMapOption } from "../../store/map-option/map-option.selectors";
import { PortGroupService } from "../../core/services/portgroup/portgroup.service";
import { selectNetmasks } from 'src/app/store/netmask/netmask.selectors';
import { selectNodesByProjectId } from 'src/app/store/node/node.selectors';
import { validateNameExist } from "../../shared/validations/name-exist.validation";
import { networksValidation } from 'src/app/shared/validations/networks.validation';
import { showErrorFromServer } from 'src/app/shared/validations/error-server-response.validation';
import { retrievedInterfaceByProjectIdAndCategory } from "../../store/interface/interface.actions";
import { ProjectService } from "../../project/services/project.service";
import { selectInterfacesByProjectIdAndCategory } from "../../store/interface/interface.selectors";
import { retrievedNodes } from 'src/app/store/node/node.actions';
import { NodeService } from 'src/app/core/services/node/node.service';

@Component({
  selector: 'app-add-update-interface-dialog',
  templateUrl: './add-update-interface-dialog.component.html',
  styleUrls: ['./add-update-interface-dialog.component.scss']
})
export class AddUpdateInterfaceDialogComponent implements OnInit, OnDestroy {
  interfaceAddForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  netmasks!: any[];
  errorMessages = ErrorMessages;
  portGroups!: any[];
  isViewMode = false;
  isEdgeDirectionChecked = false;
  selectPortGroups$ = new Subscription();
  selectInterfaces$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectNetmasks$ = new Subscription();
  selectNodes$ = new Subscription();
  gateways: any[] = [];
  interfaces: any[] = [];
  nodes: any[] = [];
  tabName = '';
  filteredPortGroups!: Observable<any[]>;
  filteredDirections!: Observable<any[]>;
  filteredNetmasks!: Observable<any[]>;
  edgesConnected = [];
  errors: any[] = [];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateInterfaceDialogComponent>,
    public helpers: HelpersService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
  ) {
    this.edgesConnected = this.data.cy.nodes(`[id="pg-${this.data.genData.port_group_id}"]`).connectedEdges()
      .map((ele: any) => ({ ...ele.data(), id: Number(ele.data('id')) }))
    this.interfaceAddForm = new FormGroup({
      orderCtr: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      nameCtr: new FormControl('', Validators.required),
      descriptionCtr: new FormControl('', Validators.required),
      categoryCtr: new FormControl(''),
      directionCtr: new FormControl(''),
      macAddressCtr: new FormControl(''),
      portGroupCtr: new FormControl(''),
      ipAllocationCtr: new FormControl(''),
      ipCtr: new FormControl('', [Validators.required]),
      dnsServerCtr: new FormControl(''),
      gatewayCtr: new FormControl(''),
      isGatewayCtr: new FormControl(''),
      isNatCtr: new FormControl(''),
      netMaskCtr: new FormControl(''),
    });
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe((portGroups: any) => {
      this.portGroups = portGroups;
      this.portGroupCtr.setValidators([autoCompleteValidator(this.portGroups)]);
      this.filteredPortGroups = this.helpers.filterOptionsPortGroup(this.portGroupCtr, this.portGroups);
    });
    this.selectInterfaces$ = this.store.select(selectInterfacesByProjectIdAndCategory).subscribe(interfaces => {
      if (interfaces) {
        this.interfaces = interfaces.map((ele: any) => ele.data);
      }
    });
    this.selectNodes$ = this.store.select(selectNodesByProjectId).subscribe(nodes => {
      this.nodes = nodes;
    });
    this.selectNetmasks$ = this.store.select(selectNetmasks).subscribe((netmasks: any) => {
      this.netmasks = netmasks;
      this.netMaskCtr.setValidators([autoCompleteValidator(this.netmasks)]);
      this.filteredNetmasks = this.helpers.filterOptions(this.netMaskCtr, this.netmasks, 'mask');
    });
    this.isViewMode = this.data.mode == 'view';
    this.tabName = this.data.tabName;
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe(mapOption => {
      this.isEdgeDirectionChecked = mapOption.isEdgeDirectionChecked
    })
  }

  ngOnDestroy(): void {
    this.selectPortGroups$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectInterfaces$.unsubscribe();
    this.selectNetmasks$.unsubscribe();
  }

  get orderCtr() { return this.interfaceAddForm.get('orderCtr'); }
  get nameCtr() { return this.interfaceAddForm.get('nameCtr'); }
  get descriptionCtr() { return this.interfaceAddForm.get('descriptionCtr'); }
  get categoryCtr() { return this.interfaceAddForm.get('categoryCtr'); }
  get directionCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceAddForm.get('directionCtr'), this.DIRECTIONS); }
  get macAddressCtr() { return this.interfaceAddForm.get('macAddressCtr'); }
  get portGroupCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceAddForm.get('portGroupCtr'), this.portGroups); }
  get ipAllocationCtr() { return this.interfaceAddForm.get('ipAllocationCtr'); }
  get ipCtr() { return this.interfaceAddForm.get('ipCtr'); }
  get dnsServerCtr() { return this.interfaceAddForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceAddForm.get('gatewayCtr') }
  get isGatewayCtr() { return this.interfaceAddForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceAddForm.get('isNatCtr'); }
  get netMaskCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceAddForm.get('netMaskCtr'), this.netmasks, 'mask'); }

  ngOnInit(): void {
    let directionValue = this.isEdgeDirectionChecked ? this.data.genData.direction : this.data.genData.prev_direction;
    directionValue = this.data.mode == 'add' || this.data.mode == 'connect' || this.data.genData.category == 'management'
      ? this.data.genData.direction : directionValue;
    this.directionCtr.setValidators([Validators.required, autoCompleteValidator(this.DIRECTIONS)]);
    this.filteredDirections = this.helpers.filterOptions(this.directionCtr, this.DIRECTIONS);
    this.orderCtr?.setValue(this.data.genData.order);
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.helpers.setAutoCompleteValue(this.directionCtr, this.DIRECTIONS, directionValue);
    this.macAddressCtr?.setValue(this.data.genData.mac_address);
    this.helpers.setAutoCompleteValue(this.portGroupCtr, this.portGroups, this.data.genData.port_group_id);
    this.ipAllocationCtr?.setValue(this.data.genData.ip_allocation);
    this.ipCtr?.setValue(this.data.genData.ip);
    this.dnsServerCtr?.setValue(this.data.genData.dns_server);
    this.gatewayCtr?.setValue(this.data.genData.gateway?.gateway ? this.data.genData.gateway.gateway : this.data.genData.gateway);
    this.isGatewayCtr?.setValue(this.data.genData.is_gateway);
    this.isNatCtr?.setValue(this.data.genData.is_nat);
    this.helpers.setAutoCompleteValue(this.netMaskCtr, this.netmasks, this.data.genData.netmask_id);
    this._disableItems(this.ipAllocationCtr?.value);
    this.ipCtr?.setValidators([
      Validators.required,
      networksValidation('single'),
      validateNameExist(() => this.edgesConnected, this.data.mode, this.data.genData.interface_pk, 'ip'),
      showErrorFromServer(() => this.errors)
    ])
    if (!this.isViewMode) {
      this.interfaceAddForm?.markAllAsTouched();
    }
  }

  private _disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_manual') {
      this.ipCtr?.enable();
      this.netMaskCtr.setValidators([Validators.required, autoCompleteValidator(this.netmasks)]);
      this.netMaskCtr?.enable();
    } else {
      this.ipCtr?.disable();
      this.netMaskCtr.setValidators([]);
      this.netMaskCtr?.disable();
    }
  }

  private _updateInterfaceOnMap(data: any) {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    ele.data('name', data.name);
    ele.data('order', data.order);
    ele.data('description', data.description);
    ele.data('category', data.category);
    ele.data('direction', data.direction);
    ele.data('mac_address', data.mac_address);
    ele.data('port_group_id', data.port_group_id);
    ele.data('port_group', data.port_group_id ? this.helpers.getOptionById(this.portGroups, data.port_group_id).name : '');
    ele.data('ip_allocation', data.ip_allocation);
    ele.data('ip', data.ip);
    ele.data('dns_server', data.dns_server);
    ele.data('gateway', data.gateway);
    ele.data('is_gateway', data.is_gateway);
    ele.data('is_nat', data.is_nat);
    const ip_str = data.ip ? data.ip : "";
    const ip = ip_str.split(".");
    const last_octet = ip.length == 4 ? "." + ip[3] : "";
    ele.data('ip_last_octet', last_octet);
    ele.data('target', `pg-${data.port_group_id}`);
    ele.data('netmask_id', data.netmask_id);
    ele.data('netmask', data.netmask_id ? this.helpers.getOptionById(this.netmasks, data.netmask_id).mask : '');
  }

  onIpAllocationChange($event: MatRadioChange) {
    this._disableItems($event.value);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addInterface() {
    const jsonDataValue = {
      order: this.orderCtr?.value,
      name: this.nameCtr?.value,
      description: this.descriptionCtr?.value,
      category: this.categoryCtr?.value,
      direction: this.directionCtr?.value.id,
      mac_address: this.macAddressCtr?.value,
      port_group_id: this.portGroupCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      ip: this.ipAllocationCtr?.value === 'static_auto' ? this.data.genData.ip : this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: this.netMaskCtr?.value.id,
      logical_map: (this.data.mode == 'add') ? {
        "map_style": {
          "width": this.data.selectedMapPref.edge_width,
          "color": this.data.selectedMapPref.edge_color,
          "text_size": this.data.selectedMapPref.text_size,
          "text_color": this.data.selectedMapPref.text_color,
          "text_halign": this.data.selectedMapPref.text_halign,
          "text_valign": this.data.selectedMapPref.text_valign,
          "text_bg_color": this.data.selectedMapPref.text_bg_color,
          "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity
        }
      } : undefined,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.add(jsonData).pipe(
      catchError(err => {
        const errorMessage = err.error.message;
        if (err.status === 422) {
          if (errorMessage.ip) {
            this.ipCtr?.setErrors({
              serverError: errorMessage.ip
            });
            this.errors.push({ 'valueCtr': this.ipCtr?.value, 'error': errorMessage.ip });
          }
        }
        return throwError(() => err);
      })
    ).subscribe((respData: any) => {
      const portGroupId = respData.result.port_group_id;
      if (portGroupId) {
        const newEdgeData = this.data.newEdgeData;
        if (!newEdgeData.target.includes('node')) {
          newEdgeData.target = newEdgeData.target === `pg-${portGroupId}` ? newEdgeData.target : `pg-${portGroupId}`;
        }
        const id = respData.id
        const ip_str = respData.result.ip ? respData.result.ip : ""
        const ip = ip_str.split(".")
        const last_octet = ip.length == 4 ? "." + ip[3] : ""
        const cyData = respData.result;
        const nodeFilterById = this.nodes.filter(node => node.id === respData.result.node_id)
        const nodeName = nodeFilterById.map(el => el.name)
        const netmaskFilterById = this.netmasks.filter(netmask => netmask.id === respData.result.netmask_id)
        const mask = netmaskFilterById.map(el => el.mask)
        cyData.id = id;
        cyData.interface_pk = id;
        cyData.ip_last_octet = last_octet
        cyData.width = cyData.logical_map.map_style.width;
        cyData.text_color = cyData.logical_map.map_style.text_color;
        cyData.text_size = cyData.logical_map.map_style.text_size;
        cyData.color = cyData.logical_map.map_style.color;
        cyData.node = nodeName;
        cyData.netmask = mask;
        this.portGroupService.get(portGroupId).subscribe(response => {
          cyData.port_group = response.result.name;
          this.helpers.addCYEdge(this.data.cy, { ...newEdgeData, ...cyData });
          this.helpers.showOrHideArrowDirectionOnEdge(this.data.cy, cyData.id)
          this.helpers.updatePGOnMap(this.data.cy, portGroupId, response.result);
        });
      }
      this.interfaceService.getByProjectIdAndCategory(this.projectService.getProjectId(), 'logical', 'all')
        .subscribe(res => {
          this.store.dispatch(retrievedInterfaceByProjectIdAndCategory({ data: res.result }))
        });
      this.toastr.success('Edge details added!');
      this.dialogRef.close(respData.result);
    });
  }

  updateInterface() {
    const successMessage = `Edge ${this.nameCtr?.value} details updated!`
    const netmask_id = this.netMaskCtr?.value.id;
    const jsonDataValue = {
      order: this.orderCtr?.value,
      name: this.nameCtr?.value,
      description: this.descriptionCtr?.value,
      category: this.categoryCtr?.value,
      direction: this.directionCtr?.value.id,
      mac_address: this.macAddressCtr?.value,
      port_group_id: this.portGroupCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      ip: this.ipAllocationCtr?.value === 'static_auto' ? this.data.genData.ip : this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: netmask_id ? netmask_id : null,
      task: successMessage
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(this.data.genData.interface_pk, jsonData).pipe(
      catchError(err => {
        const errorMessage = err.error.message;
        if (err.status === 422) {
          if (errorMessage.ip) {
            this.ipCtr?.setErrors({
              serverError: errorMessage.ip
            });
            this.errors.push({ 'valueCtr': this.ipCtr?.value, 'error': errorMessage.ip });
          }
        }
        return throwError(() => err);
      })
    ).subscribe((respData: any) => {
      const pgIdOld = this.data.genData.port_group_id
      const data = {
        ...this.data.genData,
        ...jsonData,
      }
      data.ip = respData.result.ip;
      if (data.category !== 'management') {
        this._updateInterfaceOnMap(data);
        this.helpers.showOrHideArrowDirectionOnEdge(this.data.cy, this.data.genData.interface_pk)
        const e = this.data.cy.getElementById(`${this.data.genData.interface_pk}`);
        if (data.source.includes('pg')) {
          e.move({ source: `pg-${data.port_group_id}` });
        } else {
          e.move({ target: `pg-${data.port_group_id}` });
        }
        const netmaskName = this.helpers.getOptionById(this.netmasks, data.netmask_id).name
        this.helpers.updateInterfaceOnEle(this.data.cy, `node-${data.node_id}`, {
          id: this.data.genData.interface_pk,
          value: `${data.name} - ${data.ip + netmaskName}`
        });
        if (data.port_group_id !== pgIdOld) {
          const node = this.data.cy.getElementById(`node-${data.node_id}`);
          const newEdge = {
            id: this.data.genData.interface_pk,
            value: `${node.data('name')} - ${data.name} - ${data.ip + netmaskName}`
          }
          this.helpers.addInterfaceIntoPG(this.data.cy, data.port_group_id, newEdge)
          this.helpers.removeInterfaceOnPG(this.data.cy, pgIdOld, this.data.genData.interface_pk)
        }
        this.nodeService.getNodesByProjectId(this.projectService.getProjectId()).subscribe(
          (data: any) => this.store.dispatch(retrievedNodes({ data: data.result }))
        );
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
      this.interfaceService.getByProjectIdAndCategory(this.projectService.getProjectId(), 'logical', 'all')
        .subscribe(res => {
          this.store.dispatch(retrievedInterfaceByProjectIdAndCategory({ data: res.result }))
        })
      this.dialogRef.close();
      this.toastr.success(successMessage, 'Success');
    });
  }



  connectInterfaceToPG() {
    const successMessage = 'Connected Interface to Port Group'
    const jsonDataValue = {
      order: this.orderCtr?.value,
      name: this.nameCtr?.value,
      description: this.descriptionCtr?.value,
      category: this.categoryCtr?.value,
      direction: this.directionCtr?.value.id,
      mac_address: this.macAddressCtr?.value,
      port_group_id: this.portGroupCtr?.value.id,
      ip_allocation: this.ipAllocationCtr?.value,
      ip: this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: this.netMaskCtr?.value.id,
      task: successMessage
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(this.data.genData.interface_pk, jsonData).subscribe((respData: any) => {
      const data = {
        ...this.data.genData,
        ...jsonData,
      }
      if (!Boolean(data.logical_map)) {
        data.logical_map = {}
      }
      data.logical_map.position = this.data.newNodePosition;
      data.logical_map.map_style = (this.data.mode == 'connect') ? {
        "width": this.data.selectedMapPref.edge_width,
        "color": this.data.selectedMapPref.edge_color,
        "text_size": this.data.selectedMapPref.text_size,
        "text_color": this.data.selectedMapPref.text_color,
        "text_halign": this.data.selectedMapPref.text_halign,
        "text_valign": this.data.selectedMapPref.text_valign,
        "text_bg_color": this.data.selectedMapPref.text_bg_color,
        "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity
      } : undefined;
      if (data.category !== 'management') {
        const newEdgeData = this.data.newEdgeData;
        newEdgeData.target = newEdgeData.target === `pg-${data.port_group_id}` ? newEdgeData.target : `pg-${data.port_group_id}`;
        const id = this.data.genData.interface_pk
        const ip_str = data.ip ? data.ip : ""
        const ip = ip_str.split(".")
        const last_octet = ip.length == 4 ? "." + ip[3] : ""
        const cyData = respData.result;
        cyData.id = id;
        cyData.interface_pk = id;
        cyData.ip_last_octet = last_octet
        cyData.width = cyData.logical_map.map_style.width;
        cyData.text_color = cyData.logical_map.map_style.text_color;
        cyData.text_size = cyData.logical_map.map_style.text_size;
        cyData.color = cyData.logical_map.map_style.color;
        this.helpers.addCYEdge(this.data.cy, { ...newEdgeData, ...cyData });
        this.helpers.showOrHideArrowDirectionOnEdge(this.data.cy, cyData.id)
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
      this.dialogRef.close();
      this.toastr.success(successMessage, 'Success');
    });
  }

  selectPortGroup($event: MatAutocompleteSelectedEvent) {
    const interfaceList = this.interfaces.filter(ele => ele.port_group_id === $event.option.value.id && ele.configuration?.is_gateway);
    this.gateways = interfaceList.map(ele => ele.ip);
    this.gatewayCtr?.setValue('');
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.interfaceAddForm.markAllAsTouched();
  }
}
