import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InfoPanelService } from 'src/app/core/services/info-panel/info-panel.service';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { AddUpdateInterfaceDialogComponent } from 'src/app/map/add-update-interface-dialog/add-update-interface-dialog.component';
import { ProjectService } from 'src/app/project/services/project.service';
import { DIRECTIONS } from 'src/app/shared/contants/directions.constant';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { SuccessMessages } from 'src/app/shared/enums/success-messages.enum';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { showErrorFromServer } from 'src/app/shared/validations/error-server-response.validation';
import { networksValidation } from 'src/app/shared/validations/networks.validation';
import { vlanInterfaceValidator } from 'src/app/shared/validations/vlan-interface.validation';
import { selectNotification } from 'src/app/store/app/app.selectors';
import { addPhysicalInterface, connectPhysicalInterfaces, retrievedInterfacesConnectedNode, updateConnectedPhysicalInterface } from 'src/app/store/interface/interface.actions';
import { selectInterfacesByDestinationNode, selectInterfacesBySourceNode, selectInterfacesConnectedNode, selectPhysicalInterfaces } from 'src/app/store/interface/interface.selectors';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';
import { selectNetmasks } from 'src/app/store/netmask/netmask.selectors';

@Component({
  selector: 'app-connect-interface-dialog',
  templateUrl: './connect-interface-dialog.component.html',
  styleUrls: ['./connect-interface-dialog.component.scss']
})
export class ConnectInterfaceDialogComponent implements OnInit, OnDestroy {
  @ViewChild(AddUpdateInterfaceDialogComponent) addUpdateInterfaceDialogComponent: AddUpdateInterfaceDialogComponent | undefined;
  DIRECTIONS = DIRECTIONS;
  errorMessages = ErrorMessages;
  connectInterfacePhysicalForm!: FormGroup;
  interfaceAddFormSource!: FormGroup;
  interfaceAddFormTarget!: FormGroup;
  selectSourceInterface$ = new Subscription();
  selectDestinationInterface$ = new Subscription();
  selectInterfaceConnectedNode$ = new Subscription();
  selectNotification$ = new Subscription();
  selectNetmasks$ = new Subscription();
  selectMapPref$ = new Subscription();
  sourceInterface: any[] = [];
  destinationInterface: any[] = [];
  netmasks: any[] = [];
  errors: any[] = [];
  filteredBySourceInterfaces!: Observable<any[]>;
  filteredByDestinationInterfaces!: Observable<any[]>;
  filteredDirections!: Observable<any[]>;
  filteredNetmasksSource!: Observable<any[]>;
  filteredNetmasksTarget!: Observable<any[]>;
  isHiddenButton = false;
  title = '';
  isOpenAddInterfaceFormOfSource = false;
  isOpenAddInterfaceFormOfDestination = false;
  sourceNodeId!: string;
  targetNodeId!: string;
  categorySection = 'source';
  listInterfaceConnectedSource: any[] = [];
  listInterfaceConnectedTarget: any[] = [];
  nameSourceNode: any;
  nameTargetNode: any;
  listPhysicalInterfaces: any[] = [];
  selectedMapPref: any;

  constructor(
    public helpersService: HelpersService,
    private store: Store,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ConnectInterfaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.connectInterfacePhysicalForm = new FormGroup({
      sourceInterfaceCtr: new FormControl(''),
      destinationInterfaceCtr: new FormControl('')
    })
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        if (notification.message === SuccessMessages.ADDED_NEW_EDGE_SUCCESS) {
          this.backToSelectInterfaces();
        } else {
          this.dialogRef.close();
        }
      }
    });
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((selectedMapPref: any) => {
      this.selectedMapPref = selectedMapPref;
    });
    this.selectInterfaceConnectedNode$ = this.store.select(selectPhysicalInterfaces).subscribe(interfaces => {
      if (interfaces) {
        this.listPhysicalInterfaces = interfaces
        const filteredInterfaceByCategory = interfaces.filter((el: any) => el.data.category !== 'management' && el.data.interface_fk !== null)
        this.listInterfaceConnectedTarget = filteredInterfaceByCategory.map((val: any) => val.data.interface_fk);
        this.listInterfaceConnectedSource = filteredInterfaceByCategory.map((val: any) => val.data.interface_pk);
      }
    })
    this.selectSourceInterface$ = this.store.select(selectInterfacesBySourceNode).subscribe(interfaces => {
      if (interfaces) {
        this.sourceInterface = interfaces.filter((el: any) =>
          el.category !== 'management' && !this.listInterfaceConnectedTarget.includes(el.id))
        if (this.data.mode === 'edit_connected_interface') {
          const connectedInterfaces = interfaces.find((el: any) => el.id === this.data.genData.id )
          const sourceInterface = this.sourceInterface.filter((el: any) => el.interface_id === null )
          this.sourceInterface = sourceInterface.concat(connectedInterfaces)
        }

        this.sourceInterface = this.sourceInterface.map((val: any) => ({ ...val, node: val.node?.name ? val.node?.name : val.node }))
        this.sourceInterfaceCtr.setValidators([Validators.required, autoCompleteValidator(this.sourceInterface)]);
        this.filteredBySourceInterfaces = this.helpersService.filterOptions(this.sourceInterfaceCtr, this.sourceInterface);
      }
    })
    this.selectDestinationInterface$ = this.store.select(selectInterfacesByDestinationNode).subscribe(interfaces => {
      if (interfaces) {
        this.destinationInterface = interfaces.filter((el: any) => el.category !== 'management');
        this.destinationInterface = this.destinationInterface.map((val: any) => ({ ...val, node: val.node?.name ? val.node?.name : val.node }))
        const filteredDestinationInterface = this.destinationInterface.filter((el: any) =>
          !this.listInterfaceConnectedTarget.includes(el.id) && !this.listInterfaceConnectedSource.includes(el.id))
        this.destinationInterfaceCtr.setValidators([Validators.required, autoCompleteValidator(this.destinationInterface)]);
        this.filteredByDestinationInterfaces = this.helpersService.filterOptions(this.destinationInterfaceCtr, filteredDestinationInterface);
      }
    })
    this._setTitle();
    this.nameSourceNode = this.data.nameSourceNode;
    this.nameTargetNode = this.data.nameTargetNode;

    this.interfaceAddFormSource = new FormGroup({
      orderSourceCtr: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      nameSourceCtr: new FormControl('', Validators.required),
      descriptionSourceCtr: new FormControl('', Validators.required),
      categorySourceCtr: new FormControl(''),
      directionSourceCtr: new FormControl(''),
      macAddressSourceCtr: new FormControl(''),
      ipAllocationSourceCtr: new FormControl(''),
      ipSourceCtr: new FormControl('', [Validators.required]),
      dnsServerSourceCtr: new FormControl(''),
      gatewaySourceCtr: new FormControl(''),
      isGatewaySourceCtr: new FormControl(''),
      isNatSourceCtr: new FormControl(''),
      vlanIdSourceCtr: new FormControl('', [vlanInterfaceValidator()]),
      vlanModeSourceCtr: new FormControl(''),
      netMaskSourceCtr: new FormControl(''),
    });

    this.interfaceAddFormTarget = new FormGroup({
      orderTargetCtr: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      nameTargetCtr: new FormControl('', Validators.required),
      descriptionTargetCtr: new FormControl('', Validators.required),
      categoryTargetCtr: new FormControl(''),
      directionTargetCtr: new FormControl(''),
      macAddressTargetCtr: new FormControl(''),
      ipAllocationTargetCtr: new FormControl(''),
      ipTargetCtr: new FormControl('', [Validators.required]),
      dnsServerTargetCtr: new FormControl(''),
      gatewayTargetCtr: new FormControl(''),
      isGatewayTargetCtr: new FormControl(''),
      isNatTargetCtr: new FormControl(''),
      vlanIdTargetCtr: new FormControl('', [vlanInterfaceValidator()]),
      vlanModeTargetCtr: new FormControl(''),
      netMaskTargetCtr: new FormControl(''),
    });

    this.selectNetmasks$ = this.store.select(selectNetmasks).subscribe((netmasks: any) => {
      this.netmasks = netmasks;
      this.netMaskSourceCtr.setValidators([autoCompleteValidator(this.netmasks)]);
      this.filteredNetmasksSource = this.helpersService.filterOptions(this.netMaskSourceCtr, this.netmasks, 'mask');
      this.netMaskTargetCtr.setValidators([autoCompleteValidator(this.netmasks)]);
      this.filteredNetmasksTarget = this.helpersService.filterOptions(this.netMaskTargetCtr, this.netmasks, 'mask');
    });
  }
  ngOnDestroy(): void {
    this.selectSourceInterface$.unsubscribe();
    this.selectInterfaceConnectedNode$.unsubscribe();
    this.selectDestinationInterface$.unsubscribe();
    this.selectNetmasks$.unsubscribe();
    this.selectNotification$.unsubscribe();
    this.selectMapPref$.unsubscribe();
  }

  ngOnInit(): void {
    if (this.data.mode === 'edit_connected_interface') {
      this.nameSourceNode = this.data.nameSourceNode;
      this.helpersService.setAutoCompleteValue(this.sourceInterfaceCtr, this.sourceInterface, this.data?.genData.id);
      const interfaceFk = this.data?.genData.interface_fk ? this.data?.genData.interface_fk : this.data?.genData.interface_id;
      this.nameTargetNode = this.listPhysicalInterfaces.find((ele: any) => ele.id === interfaceFk).node.name;
      this.helpersService.setAutoCompleteValue(this.destinationInterfaceCtr, this.destinationInterface, interfaceFk);
    }
  }

  get sourceInterfaceCtr() { return this.helpersService.getAutoCompleteCtr(this.connectInterfacePhysicalForm.get('sourceInterfaceCtr'), this.sourceInterface) }
  get destinationInterfaceCtr() { return this.helpersService.getAutoCompleteCtr(this.connectInterfacePhysicalForm.get('destinationInterfaceCtr'), this.destinationInterface) }

  get orderSourceCtr() { return this.interfaceAddFormSource.get('orderSourceCtr'); }
  get nameSourceCtr() { return this.interfaceAddFormSource.get('nameSourceCtr'); }
  get descriptionSourceCtr() { return this.interfaceAddFormSource.get('descriptionSourceCtr'); }
  get categorySourceCtr() { return this.interfaceAddFormSource.get('categorySourceCtr'); }
  get directionSourceCtr() { return this.helpersService.getAutoCompleteCtr(this.interfaceAddFormSource.get('directionSourceCtr'), this.DIRECTIONS); }
  get macAddressSourceCtr() { return this.interfaceAddFormSource.get('macAddressSourceCtr'); }
  get ipAllocationSourceCtr() { return this.interfaceAddFormSource.get('ipAllocationSourceCtr'); }
  get ipSourceCtr() { return this.interfaceAddFormSource.get('ipSourceCtr'); }
  get dnsServerSourceCtr() { return this.interfaceAddFormSource.get('dnsServerSourceCtr'); }
  get gatewaySourceCtr() { return this.interfaceAddFormSource.get('gatewaySourceCtr') }
  get isGatewaySourceCtr() { return this.interfaceAddFormSource.get('isGatewaySourceCtr'); }
  get isNatSourceCtr() { return this.interfaceAddFormSource.get('isNatSourceCtr'); }
  get vlanIdSourceCtr() { return this.interfaceAddFormSource.get('vlanIdSourceCtr'); }
  get vlanModeSourceCtr() { return this.interfaceAddFormSource.get('vlanModeSourceCtr'); }
  get netMaskSourceCtr() { return this.helpersService.getAutoCompleteCtr(this.interfaceAddFormSource.get('netMaskSourceCtr'), this.netmasks, 'mask'); }


  get orderTargetCtr() { return this.interfaceAddFormTarget.get('orderTargetCtr'); }
  get nameTargetCtr() { return this.interfaceAddFormTarget.get('nameTargetCtr'); }
  get descriptionTargetCtr() { return this.interfaceAddFormTarget.get('descriptionTargetCtr'); }
  get categoryTargetCtr() { return this.interfaceAddFormTarget.get('categoryTargetCtr'); }
  get directionTargetCtr() { return this.helpersService.getAutoCompleteCtr(this.interfaceAddFormTarget.get('directionTargetCtr'), this.DIRECTIONS); }
  get macAddressTargetCtr() { return this.interfaceAddFormTarget.get('macAddressTargetCtr'); }
  get ipAllocationTargetCtr() { return this.interfaceAddFormTarget.get('ipAllocationTargetCtr'); }
  get ipTargetCtr() { return this.interfaceAddFormTarget.get('ipTargetCtr'); }
  get dnsServerTargetCtr() { return this.interfaceAddFormTarget.get('dnsServerTargetCtr'); }
  get gatewayTargetCtr() { return this.interfaceAddFormTarget.get('gatewayTargetCtr') }
  get isGatewayTargetCtr() { return this.interfaceAddFormTarget.get('isGatewayTargetCtr'); }
  get isNatTargetCtr() { return this.interfaceAddFormTarget.get('isNatTargetCtr'); }
  get vlanIdTargetCtr() { return this.interfaceAddFormTarget.get('vlanIdTargetCtr'); }
  get vlanModeTargetCtr() { return this.interfaceAddFormTarget.get('vlanModeTargetCtr'); }
  get netMaskTargetCtr() { return this.helpersService.getAutoCompleteCtr(this.interfaceAddFormTarget.get('netMaskTargetCtr'), this.netmasks, 'mask'); }

  connectInterfacePhysical() {
    const taskSuccess = 'Connected Interface to Node'
    const jsonDataValue = {
      interface_id: parseInt(this.destinationInterfaceCtr?.value.id),
      task: taskSuccess
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(connectPhysicalInterfaces({ id: this.sourceInterfaceCtr.value.id, data: jsonData, target: this.destinationInterfaceCtr?.value }));
  }

  updateConnectedInterfacePhysical() {
    const edgeData = this.sourceInterfaceCtr?.value;
    const taskSuccess = 'Updated connect Interface'
    const jsonDataValue = {
      interface_id: this.destinationInterfaceCtr?.value.id,
      task: taskSuccess
    }
    const mode = edgeData.id === this.data.genData.id ? false : true;
    const currentEdgeId = this.data.genData.id;
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(updateConnectedPhysicalInterface(
      { 
        id: edgeData.id, 
        currentEdgeId: currentEdgeId,
        data: jsonData, 
        target: this.destinationInterfaceCtr?.value, 
        mode: mode 
      }
      ));
  }

  onCancelSource() {
    this.isOpenAddInterfaceFormOfSource = false;
  }

  onCancelTarget() {
    this.isOpenAddInterfaceFormOfDestination = false;
  }

  backToSelectInterfaces() {
    if (this.categorySection === 'source') {
      this.isOpenAddInterfaceFormOfSource = false;
    } else {
      this.isOpenAddInterfaceFormOfDestination = false;
    }
    this.dialogRef.updateSize('1200px');
  }

  changeSection(mode: any) {
    this.categorySection = mode;
    this.dialogRef.updateSize('1200px');
    if (mode === 'source') {
      this.isOpenAddInterfaceFormOfSource = true;
      const sourceNodeId = this.data.mode === 'connect_node' ? this.data.newEdgeData.source : this.data.genData.data.source
      this.sourceNodeId = sourceNodeId.split('-')[1]
      this.interfaceService.genData(this.sourceNodeId, undefined).subscribe(response => {
        const genData = response;
        this.directionSourceCtr.setValidators([Validators.required, autoCompleteValidator(this.DIRECTIONS)]);
        this.filteredDirections = this.helpersService.filterOptions(this.directionSourceCtr, this.DIRECTIONS);
        this.orderSourceCtr?.setValue(genData.order);
        this.nameSourceCtr?.setValue(genData.name);
        this.descriptionSourceCtr?.setValue(genData.description);
        this.categorySourceCtr?.setValue(genData.category);
        this.helpersService.setAutoCompleteValue(this.directionSourceCtr, this.DIRECTIONS, genData.direction);
        this.macAddressSourceCtr?.setValue(genData.mac_address);
        this.ipAllocationSourceCtr?.setValue(genData.ip_allocation);
        this.ipSourceCtr?.setValue(genData.ip);
        this.dnsServerSourceCtr?.setValue(genData.dns_server);
        this.gatewaySourceCtr?.setValue(genData.gateway?.gateway ? genData.gateway.gateway : genData.gateway);
        this.isGatewaySourceCtr?.setValue(genData.is_gateway);
        this.isNatSourceCtr?.setValue(genData.is_nat);
        this._disableItems(this.ipAllocationSourceCtr?.value, 'source');
        this.vlanIdSourceCtr?.setValue(genData.vlan)
        this.vlanModeSourceCtr?.setValue(genData.vlan_mode)
        this.ipSourceCtr?.setValidators([
          Validators.required,
          networksValidation('single'),
          showErrorFromServer(() => this.errors)
        ])
        this.interfaceAddFormSource?.markAllAsTouched();
      });
    } else {
      this.isOpenAddInterfaceFormOfDestination = true;
      const targetNodeId = this.data.mode === 'connect_node' ? this.data.newEdgeData.target : this.data.genData.data.target
      this.targetNodeId = targetNodeId.split('-')[1]
      this.interfaceService.genData(this.targetNodeId, undefined).subscribe(response => {
        const genData = response;
        this.directionTargetCtr.setValidators([Validators.required, autoCompleteValidator(this.DIRECTIONS)]);
        this.filteredDirections = this.helpersService.filterOptions(this.directionTargetCtr, this.DIRECTIONS);
        this.orderTargetCtr?.setValue(genData.order);
        this.nameTargetCtr?.setValue(genData.name);
        this.descriptionTargetCtr?.setValue(genData.description);
        this.categoryTargetCtr?.setValue(genData.category);
        this.helpersService.setAutoCompleteValue(this.directionTargetCtr, this.DIRECTIONS, genData.direction);
        this.macAddressTargetCtr?.setValue(genData.mac_address);
        this.ipAllocationTargetCtr?.setValue(genData.ip_allocation);
        this.ipTargetCtr?.setValue(genData.ip);
        this.dnsServerTargetCtr?.setValue(genData.dns_server);
        this.gatewayTargetCtr?.setValue(genData.gateway?.gateway ? genData.gateway.gateway : genData.gateway);
        this.isGatewayTargetCtr?.setValue(genData.is_gateway);
        this.isNatTargetCtr?.setValue(genData.is_nat);
        this._disableItems(this.ipAllocationTargetCtr?.value, 'target');
        this.vlanIdTargetCtr?.setValue(genData.vlan)
        this.vlanModeTargetCtr?.setValue(genData.vlan_mode)
        this.ipTargetCtr?.setValidators([
          Validators.required,
          networksValidation('single'),
          showErrorFromServer(() => this.errors)
        ])
        this.interfaceAddFormTarget?.markAllAsTouched();
      });
    }
  }

  addInterface(mode: any) {
    const jsonDataValue = {
      order: mode == 'source' ? this.orderSourceCtr?.value : this.orderTargetCtr?.value,
      name: mode == 'source' ? this.nameSourceCtr?.value : this.nameTargetCtr?.value,
      description: mode == 'source' ? this.descriptionSourceCtr?.value : this.descriptionTargetCtr?.value,
      category: mode == 'source' ? this.categorySourceCtr?.value : this.categoryTargetCtr?.value,
      direction: mode == 'source' ? this.directionSourceCtr?.value.id : this.directionTargetCtr?.value.id,
      mac_address: mode == 'source' ? this.macAddressSourceCtr?.value : this.macAddressTargetCtr?.value,
      ip_allocation: mode == 'source' ? this.ipAllocationSourceCtr?.value : this.ipAllocationTargetCtr?.value,
      ip: mode == 'source' ? this.ipSourceCtr?.value : this.ipTargetCtr?.value,
      dns_server: mode == 'source' ? this.dnsServerSourceCtr?.value : this.dnsServerTargetCtr?.value,
      gateway: mode == 'source' ? this.gatewaySourceCtr?.value : this.gatewayTargetCtr?.value,
      is_gateway: mode == 'source' ? this.isGatewaySourceCtr?.value : this.isGatewayTargetCtr?.value,
      is_nat: mode == 'source' ? this.isNatSourceCtr?.value : this.isNatTargetCtr?.value,
      node_id: mode == 'source' ? parseInt(this.sourceNodeId) : parseInt(this.targetNodeId),
      vlan: mode == 'source' ? this.vlanIdSourceCtr?.value : this.vlanIdTargetCtr?.value,
      vlan_mode: mode == 'source' ? this.vlanModeSourceCtr?.value : this.vlanModeTargetCtr?.value,
      netmask_id: mode == 'source' ? this.netMaskSourceCtr?.value.id : this.netMaskTargetCtr?.value.id,
      logical_map: {
        map_style: {
          "width": this.selectedMapPref.edge_width,
          "color": this.selectedMapPref.edge_color,
          "text_size": this.selectedMapPref.text_size,
          "text_color": this.selectedMapPref.text_color,
          "text_halign": this.selectedMapPref.text_halign,
          "text_valign": this.selectedMapPref.text_valign,
          "text_outline_color": this.selectedMapPref.text_outline_color,
          "text_outline_width": this.selectedMapPref.text_outline_width,
          "text_bg_color": this.selectedMapPref.text_bg_color,
          "text_bg_opacity": this.selectedMapPref.text_bg_opacity
        }
      },
      physical_map: {
        map_style: {
          "width": this.selectedMapPref.edge_width,
          "color": this.selectedMapPref.edge_color,
          "text_size": this.selectedMapPref.text_size,
          "text_color": this.selectedMapPref.text_color,
          "text_halign": this.selectedMapPref.text_halign,
          "text_valign": this.selectedMapPref.text_valign,
          "text_outline_color": this.selectedMapPref.text_outline_color,
          "text_outline_width": this.selectedMapPref.text_outline_width,
          "text_bg_color": this.selectedMapPref.text_bg_color,
          "text_bg_opacity": this.selectedMapPref.text_bg_opacity
        }
      },
      project_id: this.projectService.getProjectId()
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(addPhysicalInterface({ data: jsonData, mode: mode, netmasks: this.netmasks }));
    this.categorySection = mode;
    if (mode === 'source') {
      this.isOpenAddInterfaceFormOfSource = false;
    } else {
      this.isOpenAddInterfaceFormOfDestination = false;
    }
  }

  private _setTitle() {
    const mode = this.data.mode
    if (mode === 'connect_node') {
      this.isHiddenButton = false;
      this.title = "Connect Interface"
    } else if (mode === 'edit_connected_interface') {
      this.isHiddenButton = true;
      this.title = "Edit Connected Interface"
    } else if (mode === 'delete_interface') {
      this.title = `Delete Connected Interface`
      this.destinationInterfaceCtr?.disable();
      this.isHiddenButton = true;
    }
  }

  changeAllocationTarget($event: any) {
    const subnetAllocation = $event.value;
    if (subnetAllocation == 'static_manual') {
      this.ipTargetCtr?.enable();
      this.netMaskTargetCtr.setValidators([Validators.required, autoCompleteValidator(this.netmasks)]);
      this.netMaskTargetCtr?.enable();
    } else {
      this.ipTargetCtr?.disable();
      this.netMaskTargetCtr?.disable();
    }
  }

  changeAllocationSource($event: any) {
    const subnetAllocation = $event.value;
    if (subnetAllocation == 'static_manual') {
      this.ipSourceCtr?.enable();
      this.netMaskSourceCtr.setValidators([Validators.required, autoCompleteValidator(this.netmasks)]);
      this.netMaskSourceCtr?.enable();
    } else {
      this.ipSourceCtr?.disable();
      this.netMaskSourceCtr?.disable();
    }
  }

  private _disableItems(subnetAllocation: string, mode: string) {
    if (mode === 'source') {
      if (subnetAllocation == 'static_manual') {
        this.ipSourceCtr?.enable();
        this.netMaskSourceCtr.setValidators([Validators.required, autoCompleteValidator(this.netmasks)]);
        this.netMaskSourceCtr?.enable();
      } else {
        this.ipSourceCtr?.disable();
        this.netMaskSourceCtr?.disable();
      }
    } else {
      if (subnetAllocation == 'static_manual') {
        this.ipTargetCtr?.enable();
        this.netMaskTargetCtr.setValidators([Validators.required, autoCompleteValidator(this.netmasks)]);
        this.netMaskTargetCtr?.enable();
      } else {
        this.ipTargetCtr?.disable();
        this.netMaskTargetCtr?.disable();
      }
    }
  }
}
