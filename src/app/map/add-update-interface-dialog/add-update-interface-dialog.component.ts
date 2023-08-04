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
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { selectMapOption } from "../../store/map-option/map-option.selectors";
import { PortGroupService } from "../../core/services/portgroup/portgroup.service";
import { selectNetmasks } from 'src/app/store/netmask/netmask.selectors';
import { validateNameExist } from "../../shared/validations/name-exist.validation";
import { networksValidation } from 'src/app/shared/validations/networks.validation';
import { showErrorFromServer } from 'src/app/shared/validations/error-server-response.validation';
import { selectMapCategory } from 'src/app/store/map-category/map-category.selectors';
import { selectInterfacesByHwNodes, selectLogicalMapInterfaces } from 'src/app/store/interface/interface.selectors';
import { vlanInterfaceValidator } from 'src/app/shared/validations/vlan-interface.validation';
import { addLogicalInterface, connectInterfaceToPG, updateLogicalInterface } from "../../store/interface/interface.actions";
import { ProjectService } from "../../project/services/project.service";
import { selectInterfacesNotConnectPG } from "../../store/interface/interface.selectors";
import { NodeService } from 'src/app/core/services/node/node.service';
import { selectNotification } from 'src/app/store/app/app.selectors';
import { selectLogicalNodes } from 'src/app/store/node/node.selectors';
import { SuccessMessages } from "../../shared/enums/success-messages.enum";

@Component({
  selector: 'app-add-update-interface-dialog',
  templateUrl: './add-update-interface-dialog.component.html',
  styleUrls: ['./add-update-interface-dialog.component.scss']
})
export class AddUpdateInterfaceDialogComponent implements OnInit, OnDestroy {
  connectInterfaceToPGForm: FormGroup;
  interfacesNotConnectPG: any[] = [];
  selectInterfacesNotConnectPG$ = new Subscription();
  filteredInterfaces!: Observable<any[]>;
  isShowAddInterfaceForm = false
  interfaceAddForm: FormGroup;
  DIRECTIONS = DIRECTIONS;
  netmasks!: any[];
  errorMessages = ErrorMessages;
  portGroups!: any[];
  isViewMode = false;
  isEdgeDirectionChecked = false;
  selectPortGroups$ = new Subscription();
  selectLogicalMapInterfaces$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectNetmasks$ = new Subscription();
  selectNodes$ = new Subscription();
  selectMapCategory$ = new Subscription();
  selectInterfacesByHwNodes$ = new Subscription();
  selectNotification$ = new Subscription();
  gateways: any[] = [];
  interfaces: any[] = [];
  nodes: any[] = [];
  tabName = '';
  filteredPortGroups!: Observable<any[]>;
  filteredDirections!: Observable<any[]>;
  filteredNetmasks!: Observable<any[]>;
  filteredInterfacesByHwNodes!: Observable<any[]>;
  edgesConnected = [];
  errors: any[] = [];
  mapCategory: any;
  interfacesByHwNodes: any[] = [];

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
      .map((ele: any) => ({ ...ele.data(), id: Number(ele.data('interface_pk')) }))
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
      vlanIdCtr: new FormControl('', [vlanInterfaceValidator()]),
      vlanModeCtr: new FormControl(''),
    });
    this.connectInterfaceToPGForm = new FormGroup({
      interfaceCtr: new FormControl(''),
      targetPortGroupCtr: new FormControl(''),
    })
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        if (notification.message === SuccessMessages.ADDED_NEW_EDGE_SUCCESS) {
          this.backToSelectInterfaces();
          this.helpers.setAutoCompleteValue(
            this.interfaceCtr,
            this.interfacesNotConnectPG,
            this.interfacesNotConnectPG.slice(-1)[0].id
          )
        } else {
          this.dialogRef.close();
        }
      }
    });
    this.selectMapCategory$ = this.store.select(selectMapCategory).subscribe((mapCategory: any) => {
      this.mapCategory = mapCategory ? mapCategory : 'logical'
    })

    this.selectInterfacesByHwNodes$ = this.store.select(selectInterfacesByHwNodes).subscribe(interfacesData => {
      if (interfacesData) {
        this.interfacesByHwNodes = interfacesData
        this.interfacesByHwNodes = this.interfacesByHwNodes.filter(val => val.id !== this.data.genData.id)
        this.interfaceCtr.setValidators([autoCompleteValidator(this.interfacesByHwNodes)]);
        this.filteredInterfacesByHwNodes = this.helpers.filterOptions(this.interfaceCtr, this.interfacesByHwNodes);
      }
    })
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe((portGroups: any) => {
      this.portGroups = portGroups;
      this.portGroupCtr.setValidators([autoCompleteValidator(this.portGroups)]);
      this.targetPortGroupCtr?.setValidators([Validators.required, autoCompleteValidator(this.portGroups)]);
      this.filteredPortGroups = this.helpers.filterOptionsPortGroup(this.portGroupCtr, this.portGroups);
    });
    this.selectLogicalMapInterfaces$ = this.store.select(selectLogicalMapInterfaces).subscribe(interfaces => {
      if (interfaces) {
        this.interfaces = interfaces.map((ele: any) => ele.data);
      }
    });
    this.selectNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => {
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
    this.selectInterfacesNotConnectPG$ = this.store.select(selectInterfacesNotConnectPG).subscribe(interfaces => {
      if (interfaces) {
        this.interfacesNotConnectPG = interfaces;
        this.interfaceCtr?.setValidators([Validators.required, autoCompleteValidator(this.interfacesNotConnectPG)]);
        this.filteredInterfaces = this.helpers.filterOptions(this.interfaceCtr, this.interfacesNotConnectPG);
      }
    })
  }

  ngOnDestroy(): void {
    this.selectNodes$.unsubscribe();
    this.selectPortGroups$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectLogicalMapInterfaces$.unsubscribe();
    this.selectNetmasks$.unsubscribe();
    this.selectInterfacesNotConnectPG$.unsubscribe();
    this.selectInterfacesByHwNodes$.unsubscribe();
    this.selectNotification$.unsubscribe();
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
  get vlanIdCtr() { return this.interfaceAddForm.get('vlanIdCtr'); }
  get vlanModeCtr() { return this.interfaceAddForm.get('vlanModeCtr'); }

  get interfaceCtr() { return this.helpers.getAutoCompleteCtr(this.connectInterfaceToPGForm.get('interfaceCtr'), this.interfacesNotConnectPG) }
  get targetPortGroupCtr() { return this.helpers.getAutoCompleteCtr(this.connectInterfaceToPGForm.get('targetPortGroupCtr'), this.portGroups); }

  ngOnInit(): void {
    this._setDataAddInterfaceForm(this.data.genData, this.data.mode)
    if (this.data.mode == 'connect') {
      this.helpers.setAutoCompleteValue(this.targetPortGroupCtr, this.portGroups, this.data.genData.port_group_id);
    }
    this.helpers.setAutoCompleteValue(this.interfaceCtr, this.interfacesByHwNodes, this.data.genData.interface_fk);
    this.vlanIdCtr?.setValue(this.data.genData.vlan)
    this.vlanModeCtr?.setValue(this.data.genData.vlan_mode)
    this.interfaceAddForm?.markAllAsTouched();
  }

  connectToPortGroup() {
    const successMessage = 'Connected Interface to Port Group'
    const jsonData = {
      port_group_id: this.targetPortGroupCtr?.value.id,
      task: successMessage
    }
    this.store.dispatch(connectInterfaceToPG({
      id: this.interfaceCtr?.value.id,
      data: jsonData,
      netmasks: this.netmasks,
    }))
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
      vlan: this.vlanIdCtr?.value,
      vlan_mode: this.vlanModeCtr?.value,
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
      project_id: Number(this.data.projectId)
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(addLogicalInterface({ edge: jsonData, netmasks: this.netmasks }));
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
      vlan: this.vlanIdCtr?.value,
      vlan_mode: this.vlanModeCtr?.value,
      interface_id: this.interfaceCtr?.value.id ? parseInt(this.interfaceCtr?.value.id) : this.data.genData.interface_fk,
      task: successMessage
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(updateLogicalInterface({
      id: this.data.genData.id,
      data: jsonData,
      netmasks: this.netmasks
    }));
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

  convertToAddInterfaceForm() {
    this.isShowAddInterfaceForm = true;
    this.dialogRef.updateSize('1200px');
    this.interfaceService.genData(this.data.genData.node_id, undefined).subscribe(interfaceData => {
      this._setDataAddInterfaceForm(interfaceData, this.data.mode)
    });
  }

  backToSelectInterfaces() {
    this.isShowAddInterfaceForm = false;
    this.dialogRef.updateSize('600px');
  }

  private _setDataAddInterfaceForm(interfaceData: any, mode: string) {
    let directionValue = this.isEdgeDirectionChecked ? interfaceData?.direction : interfaceData?.prev_direction;
    directionValue = mode == 'add' || mode == 'connect' || interfaceData.category == 'management'
      ? interfaceData?.direction : directionValue;
    this.directionCtr.setValidators([Validators.required, autoCompleteValidator(this.DIRECTIONS)]);
    this.filteredDirections = this.helpers.filterOptions(this.directionCtr, this.DIRECTIONS);
    this.orderCtr?.setValue(interfaceData.order);
    this.nameCtr?.setValue(interfaceData.name);
    this.descriptionCtr?.setValue(interfaceData.description);
    this.categoryCtr?.setValue(interfaceData.category);
    const direction = directionValue ? directionValue : interfaceData.direction;
    this.helpers.setAutoCompleteValue(this.directionCtr, this.DIRECTIONS, direction);
    this.macAddressCtr?.setValue(interfaceData.mac_address);
    if (mode != 'connect') {
      this.helpers.setAutoCompleteValue(this.portGroupCtr, this.portGroups, interfaceData.port_group_id);
    }
    this.ipAllocationCtr?.setValue(interfaceData.ip_allocation);
    this.ipCtr?.setValue(interfaceData.ip);
    this.dnsServerCtr?.setValue(interfaceData.dns_server);
    this.gatewayCtr?.setValue(interfaceData.gateway?.gateway ? interfaceData.gateway.gateway : interfaceData.gateway);
    this.isGatewayCtr?.setValue(interfaceData.is_gateway);
    this.isNatCtr?.setValue(interfaceData.is_nat);
    this.helpers.setAutoCompleteValue(this.netMaskCtr, this.netmasks, interfaceData.netmask_id);
    this._disableItems(this.ipAllocationCtr?.value);
    this.ipCtr?.setValidators([
      Validators.required,
      networksValidation('single'),
      validateNameExist(() => this.edgesConnected, mode, interfaceData.id, 'ip'),
      showErrorFromServer(() => this.errors)
    ])
    if (mode == 'view') {
      this.isGatewayCtr?.disable();
      this.isNatCtr?.disable();
    } else {
      this.isGatewayCtr?.enable();
      this.isNatCtr?.enable();
    }
  }
}
