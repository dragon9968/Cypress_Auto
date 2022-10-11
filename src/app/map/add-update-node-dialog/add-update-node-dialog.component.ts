import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { Subscription } from 'rxjs';
import { selectIcons } from '../../store/icon/icon.selectors';
import { selectDevices } from '../../store/device/device.selectors';
import { selectTemplates } from '../../store/template/template.selectors';
import { selectHardwares } from '../../store/hardware/hardware.selectors';
import { selectDomains } from '../../store/domain/domain.selectors';
import { selectConfigTemplates } from '../../store/config-template/config-template.selectors';
import { selectLoginProfiles } from '../../store/login-profile/login-profile.selectors';
import { IconService } from 'src/app/core/services/icon/icon.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';

@Component({
  selector: 'app-add-update-node-dialog',
  templateUrl: './add-update-node-dialog.component.html',
  styleUrls: ['./add-update-node-dialog.component.scss']
})
export class AddUpdateNodeDialogComponent implements OnInit, OnDestroy {
  nodeAddForm: FormGroup;
  ROLES = ROLES;
  ICON_PATH = ICON_PATH;
  filteredTemplates!: any[];
  errorMessages = ErrorMessages;
  icons!: any[];
  devices!: any[];
  templates!: any[];
  hardwares!: any[];
  domains!: any[];
  configTemplates!: any[];
  loginProfiles!: any[];
  selectIcons$ = new Subscription();
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectHardwares$ = new Subscription();
  selectDomains$ = new Subscription();
  selectConfigTemplates$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  isViewMode = false;

  constructor(
    private nodeService: NodeService,
    private iconService: IconService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private store: Store,
  ) {
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.icons = icons;
    });
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      this.devices = devices;
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((hardwares: any) => {
      this.hardwares = hardwares;
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
    });
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe((configTemplates: any) => {
      this.configTemplates = configTemplates;
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe((loginProfiles: any) => {
      this.loginProfiles = loginProfiles;
    });
    this.isViewMode = this.data.mode == 'view';
    this.nodeAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      notesCtr: new FormControl(''),
      iconCtr: new FormControl('', [autoCompleteValidator(this.icons)]),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode }),
      deviceCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.devices)]),
      templateCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.templates, 'display_name')]),
      hardwareCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.hardwares)]),
      folderCtr: new FormControl('', Validators.required),
      roleCtr: new FormControl('', [Validators.required, autoCompleteValidator(ROLES)]),
      domainCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.domains)]),
      hostnameCtr: new FormControl('', Validators.required),
      configTemplateCtr: new FormControl('', [autoCompleteValidator(this.configTemplates)]),
      loginProfileCtr: new FormControl('', [autoCompleteValidator(this.loginProfiles)]),
    });
  }

  get nameCtr() { return this.nodeAddForm.get('nameCtr'); }
  get notesCtr() { return this.nodeAddForm.get('notesCtr'); }
  get iconCtr() { return this.nodeAddForm.get('iconCtr'); }
  get categoryCtr() { return this.nodeAddForm.get('categoryCtr'); }
  get deviceCtr() { return this.nodeAddForm.get('deviceCtr'); }
  get templateCtr() { return this.nodeAddForm.get('templateCtr'); }
  get hardwareCtr() { return this.nodeAddForm.get('hardwareCtr'); }
  get folderCtr() { return this.nodeAddForm.get('folderCtr'); }
  get roleCtr() { return this.nodeAddForm.get('roleCtr'); }
  get domainCtr() { return this.nodeAddForm.get('domainCtr'); }
  get hostnameCtr() { return this.nodeAddForm.get('hostnameCtr'); }
  get configTemplateCtr() { return this.nodeAddForm.get('configTemplateCtr'); }
  get loginProfileCtr() { return this.nodeAddForm.get('loginProfileCtr'); }

  ngOnInit(): void {
    if (this.isViewMode || this.data.mode == 'update') {
      this.helpers.setAutoCompleteValue(this.iconCtr, this.icons, this.data.genData.id);
    } else {
      this.helpers.setAutoCompleteValue(this.iconCtr, this.icons, this.data.genData.icon_id);
    }
    this.nameCtr?.setValue(this.data.genData.name);
    this.categoryCtr?.setValue(this.data.genData.category);
    this.disableItems(this.categoryCtr?.value);
    this.helpers.setAutoCompleteValue(this.deviceCtr, this.devices, this.data.genData.device_id);
    this.helpers.setAutoCompleteValue(this.templateCtr, this.templates, this.data.genData.template_id);
    this.helpers.setAutoCompleteValue(this.hardwareCtr, this.hardwares, this.data.genData.hardware_id);
    this.folderCtr?.setValue(this.data.genData.folder);
    this.helpers.setAutoCompleteValue(this.roleCtr, ROLES, this.data.genData.role);
    this.helpers.setAutoCompleteValue(this.domainCtr, this.domains, this.data.genData.role);
    this.hostnameCtr?.setValue(this.data.genData.hostname);
    this.helpers.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, this.data.genData.login_profile_id);
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectHardwares$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectConfigTemplates$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
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

  onCategoryChange($event: MatRadioChange) {
    this.disableItems($event.value);
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.data.templates.filter((template: any) => template.device_id == $event.option.value.id);
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }

  addNode() {
    const jsonData = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value,
      icon_id: this.iconCtr?.value.id,
      category: this.categoryCtr?.value,
      device_id: this.deviceCtr?.value.id,
      template_id: this.templateCtr?.value.id,
      hardware_id: this.hardwareCtr?.value ? this.hardwareCtr?.value.id : undefined,
      folder: this.folderCtr?.value,
      role: this.roleCtr?.value.id,
      domain_id: this.domainCtr?.value.id,
      hostname: this.hostnameCtr?.value,
      config_ids: this.configTemplateCtr?.value.id,
      login_profile: this.loginProfileCtr?.value.id,
      collection_id: this.data.collectionId,
      logical_map_position: this.data.newNodePosition,
      logical_map_style: (this.data.mode == 'add') ? {
        "height": this.data.selectedDefaultPref.node_size,
        "width": this.data.selectedDefaultPref.node_size,
        "text_size": this.data.selectedDefaultPref.text_size,
        "text_color": this.data.selectedDefaultPref.text_color,
        "text_halign": this.data.selectedDefaultPref.text_halign,
        "text_valign": this.data.selectedDefaultPref.text_valign,
        "text_bg_color": this.data.selectedDefaultPref.text_bg_color,
        "text_bg_opacity": this.data.selectedDefaultPref.text_bg_opacity,
        "background-color": "rgb(255,255,255)",
        "background-image": "",
        "background-fit": "contain"
      } : undefined,
    }
    this.nodeService.add(jsonData).subscribe((respData: any) => {
      this.nodeService.get(respData.id).subscribe(respData => {
        const cyData = respData.result;
        cyData.id = 'node-' + respData.id;
        cyData.node_id = respData.id;
        cyData.domain = this.domainCtr?.value.name;
        cyData.height = cyData.logical_map_style.height;
        cyData.width = cyData.logical_map_style.width;
        cyData.text_color = cyData.logical_map_style.text_color;
        cyData.text_size = cyData.logical_map_style.text_size;
        cyData.groups = respData.result.groups;
        cyData.icon = ICON_PATH + respData.result.icon.photo;
        this.helpers.addCYNode(this.data.cy, { newNodeData: { ...this.data.newNodeData, ...cyData }, newNodePosition: this.data.newNodePosition });
        this.helpers.reloadGroupBoxes(this.data.cy);
        this.toastr.success('Node details added!');
        this.dialogRef.close();
      });
    });
  }

  updateNode() {
    const ele = this.data.cy.getElementById('node-' + this.data.genData.id);
    const jsonData = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value,
      icon_id: this.iconCtr?.value.id,
      category: this.categoryCtr?.value,
      device_id: this.deviceCtr?.value.id,
      template_id: this.templateCtr?.value.id,
      hardware_id: this.hardwareCtr?.value ? this.hardwareCtr?.value.id : undefined,
      folder: this.folderCtr?.value,
      role: this.roleCtr?.value.id,
      domain_id: this.domainCtr?.value.id,
      hostname: this.hostnameCtr?.value,
      config_ids: this.configTemplateCtr?.value.id,
      login_profile: this.loginProfileCtr?.value.id,
      collection_id: this.data.genData.collection_id,
      logical_map_position: ele.position(),
    }
    this.nodeService.put(this.data.genData.id, jsonData).subscribe((_respData: any) => {
      this.nodeService.get(this.data.genData.id).subscribe(nodeData => {
        ele.data('name', nodeData.result.name);
        ele.data('groups', nodeData.result.groups);
        this.iconService.get(jsonData.icon_id).subscribe(iconData => {
          ele.data('icon', ICON_PATH + iconData.result.photo);
        });
        this.helpers.reloadGroupBoxes(this.data.cy);
        this.toastr.success('Node details updated!');
        this.dialogRef.close();
      })
    });
  }
}
