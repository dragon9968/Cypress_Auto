import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { CONFIG_TEMPLATE_ADDS_TYPE } from "../../../shared/contants/config-template-add-actions.constant";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { PORT } from "../../../shared/contants/port.constant";
import { AceEditorComponent } from "ng12-ace-editor";
import { networksValidation } from 'src/app/shared/validations/networks.validation';
import { ColDef, GridApi, GridReadyEvent, ValueSetterParams } from "ag-grid-community";
import { ButtonRenderersComponent } from "../../../project/renderers/button-renderers-component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { IpReservationModel, RangeModel } from "../../../core/models/config-template.model";
import { ipSubnetValidation } from "../../../shared/validations/ip-subnet.validation";

@Component({
  selector: 'app-add-edit-config-template',
  templateUrl: './add-edit-config-template.component.html',
  styleUrls: ['./add-edit-config-template.component.scss']
})
export class AddEditConfigTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") editor!: AceEditorComponent;
  private rangeGridApi!: GridApi;
  private reservationGridApi!: GridApi;
  rangeRowData: any[] = [];
  reservationRowData: any[] = [];
  PORT = PORT;
  configTemplateAddsType = CONFIG_TEMPLATE_ADDS_TYPE;
  configTemplateForm!: FormGroup;
  actionsAddForm!: FormGroup;
  configForm!: FormGroup;
  firewallRuleForm!: FormGroup;
  domainMemberForm!: FormGroup;
  roleServicesForm!: FormGroup;
  dhcpForm!: FormGroup;
  ospfForm!: FormGroup;
  bgpForm!: FormGroup;
  errorMessages = ErrorMessages;
  staticRoles: any[] = [];
  fileWallRule: any[] = [];
  fileWallPort: any[] = [];
  rolesAndService: any[] = [];
  defaultConfig: any = {}
  isViewMode = false;
  isAddMode = false;
  isAddRoute = false;
  isAddFirewallRule = false;
  isAddRolesAndService = false;
  isAddDomainMembership = false;
  isAddOSPF = false;
  bgpChecked = true;
  connectedChecked = true;
  staticChecked = true;
  isAddBGP = false;
  isAddDHCP = false;
  isDisableAddDHCP = false;
  bgpConnectedChecked = true;
  bgpOspfChecked = true;
  filteredAddActions!: Observable<any>[];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    editable: true,
  };

  rangeColumnDefs: ColDef[] = [
    {
      headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ButtonRenderersComponent,
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
      }
    },
    {
      field: 'name'
    },
    {
      field: 'start',
      valueSetter: this.setterValueNetwork.bind(this)
    },
    {
      field: 'stop',
      valueSetter: this.setterValueNetwork.bind(this),
    }
  ];

  reservationColumnDefs: ColDef[] = [
    {
      headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ButtonRenderersComponent,
      cellRendererParams: {
        onClick: this.onDeleteReservation.bind(this),
      }
    },
    {
      field: 'name'
    },
    {
      field: 'ip_address',
      headerName: 'IP Address',
      valueSetter: this.setterValueNetwork.bind(this)
    },
    {
      field: 'mac_address',
      headerName: 'MAC Address',
    }
  ];

  constructor(
    private dialog: MatDialog,
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditConfigTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpersService: HelpersService
  ) {
    this.actionsAddForm = new FormGroup({
      addTypeCtr: new FormControl('')
    })
    this.configForm = new FormGroup({
      routeCtr: new FormControl('', [Validators.required]),
      nextHopCtr: new FormControl('', [Validators.required]),
      interfaceCtr: new FormControl('')
    });
    this.firewallRuleForm = new FormGroup({
      categoryFirewallRuleCtr: new FormControl({value: 'rule', disabled: false}),
      nameFirewallRuleCtr: new FormControl({value: '', disabled: false}),
      stateCtr: new FormControl({value: 'present', disabled: false}),
      actionCtr: new FormControl('pass'),
      interfaceFirewallCtr: new FormControl({value: '', disabled: false}),
      protocolCtr: new FormControl({value: 'any', disabled: false}),
      sourceCtr: new FormControl({value: 'any', disabled: false}),
      sourcePortCtr: new FormControl({value: 'any', disabled: false}),
      sourceCustomPortCtr: new FormControl({value: 'any', disabled: true}),
      destinationCtr: new FormControl({value: 'any', disabled: false}),
      destinationPortCtr: new FormControl({value: 'any', disabled: false}),
      destCustomPortCtr: new FormControl({value: '', disabled: true}),
      targetCtr: new FormControl({value: '', disabled: true}),
      targetPortCtr: new FormControl({value: 'any', disabled: true}),
      targetCustomPortCtr: new FormControl({value: '', disabled: true}),
    });
    this.domainMemberForm = new FormGroup({
      joinDomainCtr: new FormControl(false),
      ouPathCtr: new FormControl(''),
    })
    this.roleServicesForm = new FormGroup({
      rolesCtr: new FormControl('')
    })
    this.ospfForm = new FormGroup({
      networksCtr: new FormControl('', [networksValidation('multi')]),
      bgpStateCtr: new FormControl(''),
      bgpMetricTypeCtr: new FormControl(''),
      connectedStateCtr: new FormControl(''),
      connectedMetricTypeCtr: new FormControl(''),
      staticStateCtr: new FormControl(''),
      staticMetricTypeCtr: new FormControl('')
    })
    this.bgpForm = new FormGroup({
      ipCtr: new FormControl('', [networksValidation('single')]),
      asnCtr: new FormControl(''),
      neighborIpCtr: new FormControl('', [networksValidation('single')]),
      neighborAsnCtr: new FormControl(''),
      bgpConnectedStateCtr: new FormControl(''),
      bgpConnectedMetricCtr: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      bgpOspfStateCtr: new FormControl(''),
      bgpOspfMetricCtr: new FormControl('', [Validators.pattern('^[0-9]*$')])
    })
    this.dhcpForm = new FormGroup({
      nameCtr: new FormControl(''),
      authoritativeCtr: new FormControl(true),
      subnetCtr: new FormControl('', [ipSubnetValidation(true)]),
      leaseCtr: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      dnsServerCtr: new FormControl('', [networksValidation('single')]),
      ntpServerCtr: new FormControl('', [networksValidation('single')]),
    })
    this.isViewMode = this.data.mode == 'view';
    this.isAddMode = this.data.mode == 'add';
    this.configTemplateForm = new FormGroup({
      name: new FormControl({value: '', disabled: false},
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl({value: '', disabled: false}),
      category: new FormControl({value: '', disabled: false}),
      configuration: new FormControl({value: '', disabled: false}),
    });
    this.filteredAddActions = this.helpersService.filterOptions(this.addTypeCtr, this.configTemplateAddsType);
    this.configTemplateService.getWinRoles().subscribe(data => {
      this.rolesAndService = data;
      this.rolesCtr.setValidators([Validators.required, autoCompleteValidator(this.rolesAndService)]);
    });
  }

  ngAfterViewInit(): void {
    if (this.data.mode !== 'add') {
      this.editor.getEditor().setOptions({
        tabSize: 2,
        useWorker: false,
        fontSize: '16px',
        behavioursEnabled: false,
        showPrintMargin: false
      });
      this.editor.mode = 'json';
      this.editor.setTheme('textmate');
      setTimeout(() => {
        const data = {
          config_id: this.data.genData.id,
          node_id: undefined
        }
        this.configTemplateService.getNodeDefaultConfiguration(data).subscribe(res => {
          this.defaultConfig = res.configuration;
          this.defaultConfig.firewall_rule = this.defaultConfig.firewall_rule?.map(({action, category, destination, destination_port, ...obj}: any) => ({
            action: action,
            category: category,
            destination: destination,
            dest_port: destination_port,
            ...obj,
          }))
          this.editor.value = JSON.stringify(this.defaultConfig, null, 2);
        })
      }, 0)
    }
  }

  get name() { return this.configTemplateForm.get('name'); }
  get category() { return this.configTemplateForm.get('category'); }
  get description() { return this.configTemplateForm.get('description'); }
  get configuration() { return this.configTemplateForm.get('configuration'); }
  get addTypeCtr() { return this.helpersService.getAutoCompleteCtr(this.actionsAddForm.get('addTypeCtr'), this.configTemplateAddsType) }
  get routeCtr() { return this.configForm.get('routeCtr'); }
  get nextHopCtr() { return this.configForm.get('nextHopCtr'); }
  get interfaceCtr() { return this.configForm.get('interfaceCtr'); }
  get categoryFirewallRuleCtr() { return this.firewallRuleForm.get('categoryFirewallRuleCtr'); }
  get nameFirewallRuleCtr() { return this.firewallRuleForm.get('nameFirewallRuleCtr'); }
  get stateCtr() { return this.firewallRuleForm.get('stateCtr'); }
  get actionCtr() { return this.firewallRuleForm.get('actionCtr'); }
  get interfaceFirewallCtr() { return this.firewallRuleForm.get('interfaceFirewallCtr'); }
  get protocolCtr() { return this.firewallRuleForm.get('protocolCtr'); }
  get sourceCtr() { return this.firewallRuleForm.get('sourceCtr'); }
  get sourcePortCtr() { return this.firewallRuleForm.get('sourcePortCtr'); }
  get sourceCustomPortCtr() { return this.firewallRuleForm.get('sourceCustomPortCtr'); }
  get destinationCtr() { return this.firewallRuleForm.get('destinationCtr'); }
  get destinationPortCtr() { return this.firewallRuleForm.get('destinationPortCtr'); }
  get destCustomPortCtr() { return this.firewallRuleForm.get('destCustomPortCtr'); }
  get targetCtr() { return this.firewallRuleForm.get('targetCtr'); }
  get targetPortCtr() { return this.firewallRuleForm.get('targetPortCtr'); }
  get targetCustomPortCtr() { return this.firewallRuleForm.get('targetCustomPortCtr'); }
  get joinDomainCtr() { return this.domainMemberForm.get('joinDomainCtr'); }
  get ouPathCtr() { return this.domainMemberForm.get('ouPathCtr');}
  get rolesCtr() { return this.helpersService.getAutoCompleteCtr(this.roleServicesForm.get('rolesCtr'), this.rolesAndService);}
  get networksCtr() { return this.ospfForm.get('networksCtr');}
  get bgpStateCtr() { return this.ospfForm.get('bgpStateCtr');}
  get bgpMetricTypeCtr() { return this.ospfForm.get('bgpMetricTypeCtr');}
  get connectedStateCtr() { return this.ospfForm.get('connectedStateCtr');}
  get connectedMetricTypeCtr() { return this.ospfForm.get('connectedMetricTypeCtr');}
  get staticStateCtr() { return this.ospfForm.get('staticStateCtr');}
  get staticMetricTypeCtr() { return this.ospfForm.get('staticMetricTypeCtr');}
  get ipCtr() { return this.bgpForm.get('ipCtr');}
  get asnCtr() { return this.bgpForm.get('asnCtr');}
  get neighborIpCtr() { return this.bgpForm.get('neighborIpCtr');}
  get neighborAsnCtr() { return this.bgpForm.get('neighborAsnCtr');}
  get bgpConnectedStateCtr() { return this.bgpForm.get('bgpConnectedStateCtr');}
  get bgpConnectedMetricCtr() { return this.bgpForm.get('bgpConnectedMetricCtr');}
  get bgpOspfStateCtr() { return this.bgpForm.get('bgpOspfStateCtr');}
  get bgpOspfMetricCtr() { return this.bgpForm.get('bgpOspfMetricCtr');}

  get nameCtr() { return this.dhcpForm.get('nameCtr') }
  get authoritativeCtr() { return this.dhcpForm.get('authoritativeCtr') }
  get subnetCtr() { return this.dhcpForm.get('subnetCtr') }
  get leaseCtr() { return this.dhcpForm.get('leaseCtr') }
  get dnsServerCtr() { return this.dhcpForm.get('dnsServerCtr') }
  get ntpServerCtr() { return this.dhcpForm.get('ntpServerCtr') }

  ngOnInit(): void {
    this.name?.setValue(this.data.genData.name);
    this.category?.setValue(this.data.genData.category);
    this.description?.setValue(this.data.genData.description);
    this.addTypeCtr?.setValue(this.configTemplateAddsType[0]);
    this.addTypeCtr?.setValidators([Validators.required, autoCompleteValidator(this.configTemplateAddsType)])
    this.helpersService.setAutoCompleteValue(this.addTypeCtr, this.configTemplateAddsType, this.configTemplateAddsType[0].id)
  }

  onRangeGridReady(params: GridReadyEvent) {
    this.rangeGridApi = params.api;
    this.rangeGridApi.sizeColumnsToFit();
  }

  onReservationGridReady(params: GridReadyEvent) {
    this.reservationGridApi = params.api;
    this.reservationGridApi.sizeColumnsToFit();
  }

  onDelete(params: any) {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rangeRowData.splice(params.rowData.index, 1);
        this.rangeGridApi.applyTransaction({ remove: [params.rowData] });
        this.toastr.success('Deleted range successfully', 'Success')
      }
    });
    return this.rangeRowData;
  }

  onDeleteReservation(params: any) {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reservationRowData.splice(params.rowData.index, 1);
        this.reservationGridApi.applyTransaction({ remove: [params.rowData] });
        this.toastr.success('Deleted range successfully', 'Success')
      }
    });
    return this.reservationRowData;
  }

  addRange() {
    const jsonData = {
      name: '',
      start: '',
      stop: ''
    }
    this.rangeGridApi.applyTransaction({ add: [jsonData] });
  }

  addReservation() {
    const jsonData = {
      name: '',
      ip_address: '',
      mac_address: ''
    }
    this.reservationGridApi.applyTransaction({ add: [jsonData] });
  }

  setterValueNetwork(params: ValueSetterParams) {
    return this.helpersService.setterValue(params)
  }

  onCancel() {
    this.dialogRef.close();
  }

  addConfigTemplate() {
    if (this.configTemplateForm.valid) {
      const jsonDataValue = {
        name: this.name?.value,
        description: this.description?.value,
      }
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.configTemplateService.add(jsonData).subscribe({
        next: (rest) =>{
          this.toastr.success(`Add Configuration Template successfully`);
          this.dialogRef.close();
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        },
        error:(err) => {
          this.toastr.error(`Error while add Configuration Template`);
        }
      });
    }
  }

  updateConfigTemplate() {
    if (this.configTemplateForm.valid) {
      const jsonDataValue = {
        name: this.name?.value,
        description: this.description?.value,
      };
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.configTemplateService.put(this.data.genData.id, jsonData).pipe(
        catchError(err => {
          this.toastr.error('Update configuration template failed!', 'Error');
          return throwError(() => err)
        })
      ).subscribe(() => {
        const isUpdateConfigDefault = JSON.stringify(this.defaultConfig, null, 2) !== this.editor.value;
        if (isUpdateConfigDefault) {
          const isNodeConfigDataFormatted = this.helpersService.validateJSONFormat(this.editor.value)
          const isValidJsonForm = this.helpersService.validateFieldFormat(this.editor.value)
          const isValidJsonFormBGP = this.helpersService.validationBGP(this.editor.value)
          const isDCHPFormValid = this.helpersService.validateDHCPData(this.editor.value)
          if (isNodeConfigDataFormatted && isValidJsonForm && isValidJsonFormBGP && isDCHPFormValid) {
            const configDefaultNode = {
              node_id: undefined,
              config_id: this.data.genData.id,
              ...JSON.parse(this.editor.value)
            }
            this.configTemplateService.putConfiguration(configDefaultNode).pipe(
              catchError(err => {
                this.toastr.error('Update configuration template failed!', 'Error');
                return throwError(() => err)
              })
            ).subscribe(res => {
              this.toastr.success(`Update Configuration Template successfully`);
              this.dialogRef.close();
              this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
            })
          }
        } else {
          this.toastr.success(`Update Configuration Template successfully`);
          this.dialogRef.close();
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        }
      });
    }
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }

  showAddConfigForm() {
    this.showFormAdd(this.addTypeCtr?.value.id);
  }

  selectAddType($event: MatAutocompleteSelectedEvent) {
    this.showFormAdd($event.option.value.id)
  }

  addRoute() {
    const jsonDataValue = {
      config_type: "static_route",
      config_id: this.data.genData.id,
      name: this.data.genData.name,
      description: this.data.genData.description,
      route: this.routeCtr?.value,
      next_hop: this.nextHopCtr?.value,
      interface: this.interfaceCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add Route failed', 'Error');
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add Route successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({ data: data.result })));
    });
  }

  disableItems(category: string) {
    if (category === 'port_forward') {
      this.actionCtr?.disable();
      this.protocolCtr?.disable();
      this.sourcePortCtr?.disable();
      this.targetCtr?.enable();
      this.targetPortCtr?.enable();
    } else {
      this.actionCtr?.enable();
      this.protocolCtr?.enable();
      this.sourcePortCtr?.enable();
      this.targetCtr?.disable();
      this.targetPortCtr?.disable();
      this.targetCustomPortCtr?.disable();
    }
  }

  onCategoryChange($event: any) {
    this.disableItems($event.value)
  }

  onChangeSourcePort($event: any) {
    if ($event.value === "other") {
      this.sourceCustomPortCtr?.enable();
    } else {
      this.sourceCustomPortCtr?.disable();
    }
  }

  onChangeDestinationPort($event: any) {
    if ($event.value === "other") {
      this.destCustomPortCtr?.enable();
    } else {
      this.destCustomPortCtr?.disable();
    }
  }

  onChangeTargetPort($event: any) {
    if ($event.value === "other") {
      this.targetCustomPortCtr?.enable();
    }else {
      this.targetCustomPortCtr?.disable();
    }
  }

  addFirewallRule() {
    const jsonDataValue = {
      config_type: "firewall",
      config_id: this.data.genData.id,
      category: this.categoryFirewallRuleCtr?.value,
      name: this.nameFirewallRuleCtr?.value,
      state: this.stateCtr?.value,
      action: this.actionCtr?.value,
      interface: this.interfaceFirewallCtr?.value,
      protocol: this.protocolCtr?.value,
      source: this.sourceCtr?.value,
      source_port: this.sourcePortCtr?.value,
      source_port_custom: this.sourceCustomPortCtr?.value,
      destination: this.destinationCtr?.value,
      dest_port: this.destinationPortCtr?.value,
      dest_port_custom: this.destCustomPortCtr?.value,
      target: this.targetCtr?.value,
      target_port: this.targetPortCtr?.value,
      target_port_custom: this.targetCustomPortCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add Firewall Rule failed', 'Error');
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add Firewall Rule successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
    });
  }

  addDomainMembership() {
    const jsonDataValue = {
      config_type: "domain_membership",
      config_id: this.data.genData.id,
      join_domain: this.joinDomainCtr?.value,
      ou_path: this.ouPathCtr?.value
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add Domain Membership failed', 'Error');
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add Domain Membership successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
    });
  }

  addRoleServices() {
    const jsonData = {
      config_type: "role_services",
      config_id: this.data.genData.id,
      role_services: this.rolesCtr?.value
    }
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add Roles & Service failed', 'Error')
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add Roles & Service successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({ data: data.result })));
    });
  }

  addOSPF() {
    const jsonDataValue = {
      config_type: "ospf",
      config_id: this.data.genData.id,
      networks: this.helpersService.processNetworksField(this.networksCtr?.value),
      bgp_state: this.bgpStateCtr?.value,
      bgp_metric_type: parseInt(this.bgpMetricTypeCtr?.value),
      connected_state: this.connectedStateCtr?.value,
      connected_metric_type: parseInt(this.connectedMetricTypeCtr?.value),
      static_state: this.staticStateCtr?.value,
      static_metric_type: parseInt(this.staticMetricTypeCtr?.value),
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add OPSF failed', 'Error');
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add OPSF successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
    });
  }

  addBGP() {
    const jsonDataValue = {
      config_type: "bgp",
      config_id: this.data.genData.id,
      ip_address: this.ipCtr?.value,
      asn: this.asnCtr?.value,
      neighbor_ip: this.neighborIpCtr?.value,
      neighbor_asn: this.neighborAsnCtr?.value,
      bgp_connected_state: this.bgpConnectedStateCtr?.value,
      bgp_connected_metric: parseInt(this.bgpConnectedMetricCtr?.value),
      bgp_ospf_state: this.bgpOspfStateCtr?.value,
      bgp_ospf_metric: parseInt(this.bgpOspfMetricCtr?.value)
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.configTemplateService.addConfiguration(jsonData).pipe(
      catchError(err => {
        this.toastr.error('Add BGP failed', 'Error');
        return throwError(() => err);
      })
    ).subscribe((response) => {
      this._setEditorData(response.result)
      this.toastr.success('Add BGP successfully', 'Success');
      this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
    });
  }

  addDHCP() {
    let ranges: RangeModel[] = [];
    let ipReservations: IpReservationModel[] = [];
    this.rangeGridApi.forEachNode(rangeNode => ranges.push(rangeNode.data));
    this.reservationGridApi.forEachNode(ipReservationNode => ipReservations.push(ipReservationNode.data))
    const isRangesExistEmptyValue = ranges.some(range => range.name === '' || range.start === '' || range.stop === '')
    if (isRangesExistEmptyValue) {
      this.toastr.warning('All fields in the Range table are required!', 'Warning')
    } else {
       const isIpReservationExistEmptyValue = ipReservations.some(ipReservation => ipReservation.name === '' &&
                                                                                   ipReservation.ip_address === '')
      if (isIpReservationExistEmptyValue) {
        this.toastr.warning('All fields in the IP Reservation table are required!', 'Warning')
      } else {
        const jsonDataValue = {
          config_type: 'dhcp_server',
          config_id: this.data.genData.id,
          name: this.nameCtr?.value,
          authoritative: this.authoritativeCtr?.value,
          subnet: this.subnetCtr?.value,
          lease: parseInt(this.leaseCtr?.value),
          dns_server: this.dnsServerCtr?.value,
          ntp_server: this.ntpServerCtr?.value,
          ranges: ranges,
          ip_reservations: ipReservations
        }
        const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue)
        this.configTemplateService.addConfiguration(jsonData).pipe(
          catchError(error => {
            this.toastr.error('Add a new DHCP failed', 'Error');
            return throwError(() => error)
          })
        ).subscribe(response => {
          this._setEditorData(response.result)
          this.toastr.success('Add a new DHCP successfully', 'Success');
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        })
      }
    }
  }

  showFormAdd(addType: string) {
    switch (addType) {
      case 'add_route':
        this.isAddRoute = true;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_firewall_rule':
        this.isAddRoute = false;
        this.isAddFirewallRule = true;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_domain_membership':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = true;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_roles_service':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = true;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_ospf':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = true;
        this.isAddBGP = false;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_bgp':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = true;
        this.isAddDHCP = false;
        this.dialogRef.updateSize('1000px')
        break;
      case 'add_dhcp':
        this.isAddDHCP = true;
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.dialogRef.updateSize('1200px')
        break;
      default:
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        this.isAddOSPF = false;
        this.isAddBGP = false;
        this.isAddDHCP = false;
    }
  }

  private _setEditorData(data: any) {
    this.defaultConfig = data;
    this.editor.value = JSON.stringify(this.defaultConfig, null, 2);
  }

  hideAddForm() {
    this.isAddRoute = false;
    this.isAddFirewallRule = false;
    this.isAddDomainMembership = false;
    this.isAddRolesAndService = false;
    this.isAddOSPF = false;
    this.isAddBGP = false;
  }
}
