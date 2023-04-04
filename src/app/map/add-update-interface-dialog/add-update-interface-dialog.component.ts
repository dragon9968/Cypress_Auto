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
import { Observable, Subscription } from 'rxjs';
import { selectInterfaces } from "../../store/map/map.selectors";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { retrievedInterfacesManagement } from "../../store/interface/interface.actions";
import { ProjectService } from "../../project/services/project.service";
import { selectMapOption } from "../../store/map-option/map-option.selectors";

@Component({
  selector: 'app-add-update-interface-dialog',
  templateUrl: './add-update-interface-dialog.component.html',
  styleUrls: ['./add-update-interface-dialog.component.scss']
})
export class AddUpdateInterfaceDialogComponent implements OnInit, OnDestroy {
  interfaceAddForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  errorMessages = ErrorMessages;
  portGroups!: any[];
  isViewMode = false;
  isEdgeDirectionChecked = false;
  selectPortGroups$ = new Subscription();
  selectInterfaces$ = new Subscription();
  selectMapOption$ = new Subscription();
  gateways: any[] = [];
  interfaces: any[] = [];
  tabName = '';
  filteredPortGroups!: Observable<any[]>;
  filteredDirections!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateInterfaceDialogComponent>,
    public helpers: HelpersService,
    private projectService: ProjectService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService
  ) {
    this.interfaceAddForm = new FormGroup({
      orderCtr: new FormControl('',[Validators.required, Validators.pattern('^[0-9]*$')]),
      nameCtr: new FormControl('', Validators.required),
      descriptionCtr: new FormControl('', Validators.required),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode || this.tabName == 'edgeManagement' }),
      directionCtr: new FormControl(''),
      macAddressCtr: new FormControl(''),
      portGroupCtr: new FormControl(''),
      ipAllocationCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      ipCtr: new FormControl('', Validators.required),
      dnsServerCtr: new FormControl(''),
      gatewayCtr: new FormControl(''),
      isGatewayCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      isNatCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      netMaskCtr: new FormControl({ value: '', disabled: this.isViewMode }),
    });
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe((portGroups: any) => {
      this.portGroups = portGroups;
      this.portGroupCtr.setValidators([autoCompleteValidator(this.portGroups)]);
      this.filteredPortGroups = this.helpers.filterOptionsPortGroup(this.portGroupCtr, this.portGroups);
    });
    this.selectInterfaces$ = this.store.select(selectInterfaces).subscribe(interfaces => {
      if (interfaces) {
        this.interfaces = interfaces;
      }
    })
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
  }

  get orderCtr() { return this.interfaceAddForm.get('orderCtr'); }
  get nameCtr() { return this.interfaceAddForm.get('nameCtr'); }
  get descriptionCtr() { return this.interfaceAddForm.get('descriptionCtr'); }
  get categoryCtr() { return this.interfaceAddForm.get('categoryCtr'); }
  get directionCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceAddForm.get('directionCtr'), DIRECTIONS); }
  get macAddressCtr() { return this.interfaceAddForm.get('macAddressCtr'); }
  get portGroupCtr() { return this.helpers.getAutoCompleteCtr(this.interfaceAddForm.get('portGroupCtr'), this.portGroups); }
  get ipAllocationCtr() { return this.interfaceAddForm.get('ipAllocationCtr'); }
  get ipCtr() { return this.interfaceAddForm.get('ipCtr'); }
  get dnsServerCtr() { return this.interfaceAddForm.get('dnsServerCtr'); }
  get gatewayCtr() { return this.interfaceAddForm.get('gatewayCtr') }
  get isGatewayCtr() { return this.interfaceAddForm.get('isGatewayCtr'); }
  get isNatCtr() { return this.interfaceAddForm.get('isNatCtr'); }
  get netMaskCtr() { return this.interfaceAddForm.get('netMaskCtr'); }

  ngOnInit(): void {
    let directionValue = this.isEdgeDirectionChecked ? this.data.genData.direction : this.data.genData.prev_direction;
    directionValue = this.data.mode == 'add' ? '' : directionValue
    this.directionCtr.setValidators([Validators.required, autoCompleteValidator(this.DIRECTIONS)]);
    this.filteredDirections = this.helpers.filterOptions(this.directionCtr, this.DIRECTIONS);
    this.orderCtr?.setValue(this.data.genData.order);
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.helpers.setAutoCompleteValue(this.directionCtr, DIRECTIONS, directionValue);
    this.macAddressCtr?.setValue(this.data.genData.mac_address);
    this.helpers.setAutoCompleteValue(this.portGroupCtr, this.portGroups, this.data.genData.port_group_id);
    this.ipAllocationCtr?.setValue(this.data.genData.ip_allocation);
    this.ipCtr?.setValue(this.data.genData.ip);
    this.dnsServerCtr?.setValue(this.data.genData.dns_server);
    this.gatewayCtr?.setValue(this.data.genData.gateway?.gateway ? this.data.genData.gateway.gateway : this.data.genData.gateway);
    this.isGatewayCtr?.setValue(this.data.genData.is_gateway);
    this.isNatCtr?.setValue(this.data.genData.is_nat);
    this.netMaskCtr?.setValue(this.data.genData.netmask);
    this._disableItems(this.ipAllocationCtr?.value);
    this.netMaskCtr?.disable();
  }

  private _disableItems(subnetAllocation: string) {
    if (subnetAllocation == 'static_manual') {
      this.ipCtr?.enable();
    } else {
      this.ipCtr?.disable();
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
      ip: this.ipCtr?.value,
      dns_server: this.dnsServerCtr?.value,
      gateway: this.gatewayCtr?.value,
      is_gateway: this.isGatewayCtr?.value,
      is_nat: this.isNatCtr?.value,
      node_id: this.data.genData.node_id,
      netmask_id: this.data.genData.netmask_id,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "width": this.data.selectedMapPref.edge_width,
        "color": this.data.selectedMapPref.edge_color,
        "text_size": this.data.selectedMapPref.text_size,
        "text_color": this.data.selectedMapPref.text_color,
        "text_halign": this.data.selectedMapPref.text_halign,
        "text_valign": this.data.selectedMapPref.text_valign,
        "text_bg_color": this.data.selectedMapPref.text_bg_color,
        "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity,
      } : undefined,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.add(jsonData).subscribe((respData: any) => {
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
        cyData.id = id;
        cyData.interface_id = id;
        cyData.ip_last_octet = last_octet
        cyData.width = cyData.logical_map_style.width;
        cyData.text_color = cyData.logical_map_style.text_color;
        cyData.text_size = cyData.logical_map_style.text_size;
        cyData.color = cyData.logical_map_style.color;
        this.helpers.addCYEdge(this.data.cy, { ...newEdgeData, ...cyData });
        this._showOrHideArrowDirectionOnEdge(cyData.id)
      }
      this.toastr.success('Edge details added!');
      this.dialogRef.close();
    });
  }

  updateInterface() {
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
      netmask_id: this.data.genData.netmask_id,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(this.data.genData.interface_id, jsonData).subscribe((respData: any) => {
      const data = {
        ...this.data.genData,
        ...jsonData,
      }
      data.ip = respData.result.ip;
      if (data.category == 'management') {
        const newInterfacesManagement = this.infoPanelService.getNewInterfacesManagement([data]);
        this.store.dispatch(retrievedInterfacesManagement({ data: newInterfacesManagement }));
      } else {
        this._updateInterfaceOnMap(data);
        this._showOrHideArrowDirectionOnEdge(this.data.genData.interface_id)
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
      this.dialogRef.close();
      this.toastr.success('Edge details updated!');
    });
  }

  connectInterfaceToPG() {
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
      netmask_id: this.data.genData.netmask_id,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.interfaceService.put(this.data.genData.interface_id, jsonData).subscribe((respData: any) => {
      const data = {
        ...this.data.genData,
        ...jsonData,
      }
      data.logical_map_position = this.data.newNodePosition;
      data.logical_map_style = (this.data.mode == 'connect') ? {
        "width": this.data.selectedMapPref.edge_width,
        "color": this.data.selectedMapPref.edge_color,
        "text_size": this.data.selectedMapPref.text_size,
        "text_color": this.data.selectedMapPref.text_color,
        "text_halign": this.data.selectedMapPref.text_halign,
        "text_valign": this.data.selectedMapPref.text_valign,
        "text_bg_color": this.data.selectedMapPref.text_bg_color,
        "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity,
      } : undefined;
      if (data.category == 'management') {
        const newInterfacesManagement = this.infoPanelService.getNewInterfacesManagement([data]);
        this.store.dispatch(retrievedInterfacesManagement({ data: newInterfacesManagement }));
      } else {
        const newEdgeData = this.data.newEdgeData;
        newEdgeData.target = newEdgeData.target === `pg-${data.port_group_id}` ? newEdgeData.target : `pg-${data.port_group_id}`;
        const id = this.data.genData.interface_id
        const ip_str = data.ip ? data.ip : ""
        const ip = ip_str.split(".")
        const last_octet = ip.length == 4 ? "." + ip[3] : ""
        const cyData = respData.result;
        cyData.id = id;
        cyData.interface_id = id;
        cyData.ip_last_octet = last_octet
        cyData.width = cyData.logical_map_style.width;
        cyData.text_color = cyData.logical_map_style.text_color;
        cyData.text_size = cyData.logical_map_style.text_size;
        cyData.color = cyData.logical_map_style.color;
        this.helpers.addCYEdge(this.data.cy, { ...newEdgeData, ...cyData });
        this._showOrHideArrowDirectionOnEdge(cyData.id)
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
      this.dialogRef.close();
      this.toastr.success('Connected Interface to Port Group', 'Success');
    });
  }

  selectPortGroup($event: MatAutocompleteSelectedEvent) {
    const interfaceList = this.interfaces.filter(ele => ele.port_group_id === $event.option.value.id && ele.configuration.is_gateway);
    this.gateways = interfaceList.map(ele => ele.ip);
    this.gatewayCtr?.setValue('');
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }

  private _showOrHideArrowDirectionOnEdge(edgeId: any) {
    const edge = this.data.cy.getElementById(edgeId);
    if (!this.isEdgeDirectionChecked) {
      const current_dir = edge.data('direction');
      edge.data('prev_direction', current_dir);
      edge.data('direction', 'none');
    }
  }
}
