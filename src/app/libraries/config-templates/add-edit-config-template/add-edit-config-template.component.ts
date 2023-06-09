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

@Component({
  selector: 'app-add-edit-config-template',
  templateUrl: './add-edit-config-template.component.html',
  styleUrls: ['./add-edit-config-template.component.scss']
})
export class AddEditConfigTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") editor: any;
  PORT = PORT;
  configTemplateAddsType = CONFIG_TEMPLATE_ADDS_TYPE;
  configTemplateForm!: FormGroup;
  actionsAddForm!: FormGroup;
  configForm!: FormGroup;
  firewallRuleForm!: FormGroup;
  domainMemberForm!: FormGroup;
  roleServicesForm!: FormGroup;
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
  filteredAddActions!: Observable<any>[];

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
        fontSize: '16px'
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
          this.defaultConfig.firewall_rule = this.defaultConfig.firewall_rule.map(({action, category, destination, destination_port, ...obj}: any) => ({
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

  ngOnInit(): void {
    this.name?.setValue(this.data.genData.name);
    this.category?.setValue(this.data.genData.category);
    this.description?.setValue(this.data.genData.description);
    this.addTypeCtr?.setValue(this.configTemplateAddsType[0]);
    this.addTypeCtr?.setValidators([Validators.required, autoCompleteValidator(this.configTemplateAddsType)])
    this.helpersService.setAutoCompleteValue(this.addTypeCtr, this.configTemplateAddsType, this.configTemplateAddsType[0].id)
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
          if (isNodeConfigDataFormatted) {
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

  showFormAdd(addType: string) {
    switch (addType) {
      case 'add_route':
        this.isAddRoute = true;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        break;
      case 'add_firewall_rule':
        this.isAddRoute = false;
        this.isAddFirewallRule = true;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
        break;
      case 'add_domain_membership':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = true;
        this.isAddRolesAndService = false;
        break;
      case 'add_roles_service':
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = true;
        break;
      default:
        this.isAddRoute = false;
        this.isAddFirewallRule = false;
        this.isAddDomainMembership = false;
        this.isAddRolesAndService = false;
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
  }
}
