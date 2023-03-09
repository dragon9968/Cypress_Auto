import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ROLES } from 'src/app/shared/contants/roles.constant';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NodeService } from 'src/app/core/services/node/node.service';
import { Store } from '@ngrx/store';
import { catchError, Observable, of, Subscription, throwError } from 'rxjs';
import { selectIcons } from '../../store/icon/icon.selectors';
import { selectDevices } from '../../store/device/device.selectors';
import { selectTemplates } from '../../store/template/template.selectors';
import { selectHardwares } from '../../store/hardware/hardware.selectors';
import { selectDomains } from '../../store/domain/domain.selectors';
import { selectConfigTemplates } from '../../store/config-template/config-template.selectors';
import { selectLoginProfiles } from '../../store/login-profile/login-profile.selectors';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { selectNodesByCollectionId } from 'src/app/store/node/node.selectors';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { hostnameValidator } from 'src/app/shared/validations/hostname.validation';
import { ErrorStateMatcher } from '@angular/material/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { InterfaceService } from "../../core/services/interface/interface.service";
import { ConfigTemplateService } from "../../core/services/config-template/config-template.service";

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control?.dirty && (
      control?.errors?.['required'] ||
      form?.errors?.['isNotMatchPattern'] ||
      form?.errors?.['isNotMatchLength']
    );
  }
}

@Component({
  selector: 'app-add-update-node-dialog',
  templateUrl: './add-update-node-dialog.component.html',
  styleUrls: ['./add-update-node-dialog.component.scss']
})
export class AddUpdateNodeDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("editor") editor: any;
  private gridApi!: GridApi;
  nodeAddForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  ROLES = ROLES;
  ICON_PATH = ICON_PATH;
  filteredTemplatesByDevice!: any[];
  errorMessages = ErrorMessages;
  icons!: any[];
  devices!: any[];
  templates!: any[];
  hardwares!: any[];
  domains!: any[];
  configTemplates!: any[];
  loginProfiles!: any[];
  nodes!: any[];
  selectIcons$ = new Subscription();
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectHardwares$ = new Subscription();
  selectDomains$ = new Subscription();
  selectConfigTemplates$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  selectNodes$ = new Subscription();
  isViewMode = false;
  filteredIcons!: Observable<any[]>;
  filteredDevices!: Observable<any[]>;
  filteredTemplates!: Observable<any[]>;
  filteredHardwares!: Observable<any[]>;
  filteredDomains!: Observable<any[]>;
  filteredRoles!: Observable<any[]>;
  filteredConfigTemplates!: Observable<any[]>;
  filteredLoginProfiles!: Observable<any[]>;
  rowData$!: Observable<any[]>;
  public gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    rowSelection: 'multiple',
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        headerName: 'Interface Name',
        minWidth: 145,
        flex: 1,
      },
      {
        field: 'ip',
        headerName: 'IP Address',
        minWidth: 160,
        flex: 1,
      },
      {
        field: 'description',
        flex: 1,
      }
    ]
  };
  defaultConfig = {}

  constructor(
    private nodeService: NodeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private store: Store,
    private interfaceService: InterfaceService,
    private configTemplateService: ConfigTemplateService
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.nodeAddForm = new FormGroup({
      nameCtr: new FormControl('', [
        Validators.required,
        validateNameExist(() => this.nodes, this.data.mode, this.data.genData.node_id)
      ]),
      notesCtr: new FormControl(''),
      iconCtr: new FormControl(''),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      deviceCtr: new FormControl(''),
      templateCtr: new FormControl(''),
      hardwareCtr: new FormControl(''),
      folderCtr: new FormControl('', Validators.required),
      parentFolderCtr: new FormControl(''),
      roleCtr: new FormControl(''),
      domainCtr: new FormControl(''),
      hostnameCtr: new FormControl('', Validators.required),
      configTemplateCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      loginProfileCtr: new FormControl(''),
    }, { validators: hostnameValidator });
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.icons = icons;
      this.iconCtr.setValidators([autoCompleteValidator(this.icons)]);
      this.filteredIcons = this.helpers.filterOptions(this.iconCtr, this.icons);
    });
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      this.devices = devices;
      this.deviceCtr.setValidators([Validators.required, autoCompleteValidator(this.devices)]);
      this.filteredDevices = this.helpers.filterOptions(this.deviceCtr, this.devices);
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      this.templates = templates;
      this.templateCtr.setValidators([Validators.required, autoCompleteValidator(this.templates, 'display_name')]);
      this.filteredTemplates = templates;
      this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    });
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((hardwares: any) => {
      this.hardwares = hardwares;
      this.hardwareCtr.setValidators([Validators.required, autoCompleteValidator(this.hardwares)]);
      this.filteredHardwares = this.helpers.filterOptions(this.hardwareCtr, this.hardwares);
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
      this.domainCtr.setValidators([Validators.required, autoCompleteValidator(this.domains)]);
      this.filteredDomains = this.helpers.filterOptions(this.domainCtr, this.domains);
    });
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe((configTemplates: any) => {
      this.configTemplates = configTemplates;
      this.configTemplateCtr?.setValidators([autoCompleteValidator(this.configTemplates)]);
      this.filteredConfigTemplates = this.helpers.filterOptions(this.configTemplateCtr, this.configTemplates);
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe((loginProfiles: any) => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpers.filterOptions(this.loginProfileCtr, this.loginProfiles);
    });
    this.selectNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodes => this.nodes = nodes);
    this.interfaceService.getByNode(this.data.genData.node_id).subscribe(response => {
      const interfaceData = response.result;
      if (this.gridApi) {
        this.gridApi.setRowData(interfaceData);
      } else {
        this.rowData$ = of(interfaceData);
      }
    })
  }

  ngAfterViewInit(): void {
    this.editor.getEditor().setOptions({
      tabSize: 2,
      useWorker: false,
      fontSize: '16px'
    });
    this.editor.mode = 'json';
    this.editor.setTheme('textmate');
    this.configTemplateService.get(this.data.genData.default_config_id).subscribe(res => {
      this.defaultConfig = res.result._configuration;
      this.editor.value = JSON.stringify(this.defaultConfig, null, 2);
    })
  }

  get nameCtr() { return this.nodeAddForm.get('nameCtr'); }
  get notesCtr() { return this.nodeAddForm.get('notesCtr'); }
  get iconCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('iconCtr'), this.icons); }
  get categoryCtr() { return this.nodeAddForm.get('categoryCtr'); }
  get deviceCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('deviceCtr'), this.devices); }
  get templateCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('templateCtr'), this.templates); }
  get hardwareCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('hardwareCtr'), this.hardwares); }
  get folderCtr() { return this.nodeAddForm.get('folderCtr'); }
  get parentFolderCtr() { return this.nodeAddForm.get('parentFolderCtr'); }
  get roleCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('roleCtr'), ROLES); }
  get domainCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('domainCtr'), this.domains); }
  get hostnameCtr() { return this.nodeAddForm.get('hostnameCtr'); }
  get configTemplateCtr() { return this.nodeAddForm.get('configTemplateCtr'); }
  get loginProfileCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('loginProfileCtr'), this.loginProfiles); }

  ngOnInit(): void {
    this.roleCtr.setValidators([Validators.required, autoCompleteValidator(this.ROLES)]);
    this.filteredRoles = this.helpers.filterOptions(this.roleCtr, this.ROLES);
    this.helpers.setAutoCompleteValue(this.iconCtr, this.icons, this.data.genData.icon_id);
    this.nameCtr?.setValue(this.data.genData.name);
    this.notesCtr?.setValue(this.data.genData.notes);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.disableItems(this.categoryCtr?.value);
    this.helpers.setAutoCompleteValue(this.deviceCtr, this.devices, this.data.genData.device_id);
    this.filteredTemplatesByDevice = this.templates.filter((template: any) => template.device_id == this.data.genData.device_id);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.helpers.setAutoCompleteValue(this.templateCtr, this.templates, this.data.genData.template_id);
    this.helpers.setAutoCompleteValue(this.hardwareCtr, this.hardwares, this.data.genData.hardware_id);
    this.folderCtr?.setValue(this.data.genData.folder);
    this.parentFolderCtr?.setValue(this.data.genData.parent_folder);
    this.helpers.setAutoCompleteValue(this.roleCtr, ROLES, this.data.genData.role);
    this.helpers.setAutoCompleteValue(this.domainCtr, this.domains, this.data.genData.domain_id);
    this.hostnameCtr?.setValue(this.data.genData.hostname);
    this.helpers.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, this.data.genData.login_profile_id);
    if (this.data.genData.configs) {
      this.configTemplateCtr?.setValue(this.data.genData.configs.map((item: any) => item.id));
    }
    this.helpers.validateAllFormFields(this.nodeAddForm);
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectHardwares$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectConfigTemplates$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
    this.selectNodes$.unsubscribe();
  }

  private disableItems(category: string) {
    if (category == 'hw') {
      this.deviceCtr?.disable();
      this.templateCtr?.disable();
      this.hardwareCtr?.enable();
    } else {
      this.deviceCtr?.enable();
      this.templateCtr?.enable();
      this.hardwareCtr?.disable();
    }
  }

  private _updateNodeOnMap(data: any) {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    ele.data('name', data.name);
    ele.data('notes', data.notes);
    ele.data('icon', ICON_PATH + data.icon.photo);
    ele.data('icon_id', data.icon_id);
    ele.data('category', data.category);
    ele.data('device', data.device);
    ele.data('device_id', data.device_id);
    ele.data('template', data.template);
    ele.data('template_id', data.template_id);
    ele.data('hardware', data.hardware);
    ele.data('hardware_id', data.hardware_id);
    ele.data('folder', data.folder);
    ele.data('parent_folder', data.parent_folder);
    ele.data('role', data.role);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('hostname', data.hostname);
    ele.data('login_profile_id', data.login_profile_id);
    ele.data('login_profile_show', data.login_profile_show);
    ele.data('configs', data.configs);
    ele.data('configuration_show', data.configuration_show);
    ele.data('groups', data.groups);
  }

  onCategoryChange($event: MatRadioChange) {
    this.disableItems($event.value);
  }

  disableTemplate(deviceId: string) {
    this.filteredTemplatesByDevice = this.templates.filter(template => template.device.id == deviceId);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.templateCtr?.setValue('');
    if (this.filteredTemplatesByDevice.length > 0) {
      this.templateCtr?.enable();
    } else {
      this.templateCtr?.disable();
    }
  }

  changeDevice() {
    this.disableTemplate(this.deviceCtr?.value.id);
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.disableTemplate($event.option.value.id);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addNode() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value,
      icon_id: this.iconCtr?.value.id,
      category: this.categoryCtr?.value,
      device_id: this.deviceCtr?.value.id,
      template_id: this.templateCtr?.value.id,
      hardware_id: this.hardwareCtr?.value ? this.hardwareCtr?.value.id : undefined,
      folder: this.folderCtr?.value,
      parent_folder: this.parentFolderCtr?.value,
      role: this.roleCtr?.value.id,
      domain_id: this.domainCtr?.value.id,
      hostname: this.hostnameCtr?.value,
      login_profile_id: this.loginProfileCtr?.value.id,
      collection_id: this.data.collectionId,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "height": this.data.selectedMapPref.node_size,
        "width": this.data.selectedMapPref.node_size,
        "text_size": this.data.selectedMapPref.text_size,
        "text_color": this.data.selectedMapPref.text_color,
        "text_halign": this.data.selectedMapPref.text_halign,
        "text_valign": this.data.selectedMapPref.text_valign,
        "text_bg_color": this.data.selectedMapPref.text_bg_color,
        "text_bg_opacity": this.data.selectedMapPref.text_bg_opacity,
        "background-color": "rgb(255,255,255)",
        "background-image": "",
        "background-fit": "contain"
      } : undefined,
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.nodeService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error('Add new node failed', 'Error');
        return throwError(() => e);
      })
    ).subscribe((respData: any) => {
      this.nodeService.get(respData.id).subscribe(respData => {
        const cyData = respData.result;
        this.helpers.updateNodesStorage({...cyData});
        cyData.id = 'node-' + respData.id;
        cyData.node_id = respData.id;
        cyData.domain = this.domainCtr?.value.name;
        cyData.height = cyData.logical_map_style.height;
        cyData.width = cyData.logical_map_style.width;
        cyData.text_color = cyData.logical_map_style.text_color;
        cyData.text_size = cyData.logical_map_style.text_size;
        cyData.text_bg_color = cyData.logical_map_style.text_bg_color;
        cyData.text_bg_opacity = cyData.logical_map_style.text_bg_opacity;
        cyData.text_valign = cyData.logical_map_style.text_valign;
        cyData.text_halign = cyData.logical_map_style.text_halign;
        cyData.groups = respData.result.groups;
        cyData.icon = ICON_PATH + respData.result.icon.photo;
        this.helpers.addCYNode(this.data.cy, { newNodeData: { ...this.data.newNodeData, ...cyData }, newNodePosition: this.data.newNodePosition });
        if (this.configTemplateCtr?.value) {
          const configData = {
            pk: respData.id,
            config_ids: this.configTemplateCtr?.value
          }
          this.nodeService.associate(configData).subscribe(respData => {
            this.nodeService.get(cyData.node_id).subscribe(nodeData => {
              this.data.genData.id = cyData.id;
              this._updateNodeOnMap(nodeData.result);
            })
          });
        }
        this.helpers.reloadGroupBoxes(this.data.cy);
        this.toastr.success('Node details added!');
        this.dialogRef.close();
      });
    });
  }

  updateNode() {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    const jsonDataValue = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value,
      icon_id: this.iconCtr?.value.id,
      category: this.categoryCtr?.value,
      device_id: this.deviceCtr?.value.id,
      template_id: this.templateCtr?.value.id,
      hardware_id: this.hardwareCtr?.value ? this.hardwareCtr?.value.id : undefined,
      folder: this.folderCtr?.value,
      parent_folder: this.parentFolderCtr?.value,
      role: this.roleCtr?.value.id,
      domain_id: this.domainCtr?.value.id,
      hostname: this.hostnameCtr?.value,
      login_profile_id: this.loginProfileCtr?.value.id ? this.loginProfileCtr?.value.id : null,
      collection_id: this.data.genData.collection_id,
      logical_map_position: ele.position(),
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.nodeService.put(this.data.genData.node_id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error('Update node failed!', 'Error');
        return throwError(() => e);
      })
    ).subscribe((_respData: any) => {
      if (this.configTemplateCtr?.value) {
        const configData = {
          pk: this.data.genData.node_id,
          config_ids: this.configTemplateCtr?.value
        }
        this.nodeService.associate(configData).subscribe(respData => {
          this.store.dispatch(retrievedMapSelection({ data: true }));
          this.nodeService.get(this.data.genData.node_id).subscribe(nodeData => {
            this.helpers.updateNodesStorage(nodeData.result);
            this._updateNodeOnMap(nodeData.result);
            this.helpers.reloadGroupBoxes(this.data.cy);
            this.dialogRef.close();
            this.store.dispatch(retrievedMapSelection({ data: true }));
            this.toastr.success('Node details updated!');
          });
        });
      }
    });
  }

  changeViewToEdit() {
    this.configTemplateCtr?.enable();
    this.categoryCtr?.enable();
    this.data.mode = 'update';
    this.isViewMode = false;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}
