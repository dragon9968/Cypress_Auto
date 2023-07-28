import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup } from "@angular/forms";
import { forkJoin, map, Observable, of, Subscription } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ROLES } from "../../../shared/contants/roles.constant";
import { ICON_PATH } from "src/app/shared/contants/icon-path.constant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { selectIcons } from "../../../store/icon/icon.selectors";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { selectDevices } from "../../../store/device/device.selectors";
import { selectTemplates } from "../../../store/template/template.selectors";
import { selectLoginProfiles } from "../../../store/login-profile/login-profile.selectors";
import { selectConfigTemplates } from "../../../store/config-template/config-template.selectors";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { retrievedGroups } from "../../../store/group/group.actions";
import { GroupService } from "../../../core/services/group/group.service";
import { bulkEditNode } from "src/app/store/node/node.actions";
import { selectNotification } from "src/app/store/app/app.selectors";

@Component({
  selector: 'app-node-bulk-edit-dialog',
  templateUrl: './node-bulk-edit-dialog.component.html',
  styleUrls: ['./node-bulk-edit-dialog.component.scss']
})
export class NodeBulkEditDialogComponent implements OnInit, OnDestroy {
  nodeBulkEditForm: FormGroup;
  errorMessages = ErrorMessages;
  ROLES = ROLES;
  ICON_PATH = ICON_PATH;
  icons!: any[];
  devices!: any[];
  templates!: any[];
  domains!: any[];
  configTemplates!: any[];
  loginProfiles!: any[]
  filteredTemplatesByDevice!: any[];
  projectId = '0';
  selectIcons$ = new Subscription();
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectDomains$ = new Subscription();
  selectConfigTemplates$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  selectNotification$ = new Subscription();
  filteredIcons!: Observable<any[]>;
  filteredDevices!: Observable<any[]>;
  filteredTemplates!: Observable<any[]>;
  filteredHardwares!: Observable<any[]>;
  filteredDomains!: Observable<any[]>;
  filteredRoles!: Observable<any[]>;
  filteredConfigTemplates!: Observable<any[]>;
  filteredLoginProfiles!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NodeBulkEditDialogComponent>,
    public helpers: HelpersService,
    private nodeService: NodeService,
    private projectService: ProjectService,
    private groupService: GroupService
  ) {
    this.nodeBulkEditForm = new FormGroup({
      iconCtr: new FormControl(''),
      deviceCtr: new FormControl(''),
      templateCtr: new FormControl(''),
      domainCtr: new FormControl(''),
      folderCtr: new FormControl(''),
      parentFolderCtr: new FormControl(''),
      roleCtr: new FormControl(''),
      configTemplateCtr: new FormControl(''),
      loginProfileCtr: new FormControl(''),
    });
    this.selectIcons$ = this.store.select(selectIcons).subscribe(icons => {
      this.icons = icons;
      this.iconCtr.setValidators([autoCompleteValidator(this.icons)]);
      this.filteredIcons = this.helpers.filterOptions(this.iconCtr, this.icons);
    });
    this.selectDevices$ = this.store.select(selectDevices).subscribe(devices => {
      this.devices = devices;
      this.deviceCtr.setValidators([autoCompleteValidator(this.devices)]);
      this.filteredDevices = this.helpers.filterOptions(this.deviceCtr, this.devices);
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templates => {
      this.templates = templates;
      this.templateCtr.setValidators([autoCompleteValidator(this.templates, 'display_name')]);
      this.filteredTemplatesByDevice = templates;
      this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => {
      this.domains = domains;
      this.domainCtr.setValidators([autoCompleteValidator(this.domains)]);
      this.filteredDomains = this.helpers.filterOptions(this.domainCtr, this.domains);
    });
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe(configTemplates => {
      this.configTemplates = configTemplates;
      this.configTemplateCtr?.setValidators([autoCompleteValidator(this.configTemplates)]);
      this.filteredConfigTemplates = this.helpers.filterOptions(this.configTemplateCtr, this.configTemplates);
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpers.filterOptions(this.loginProfileCtr, this.loginProfiles);
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      } 
    });
  }

  get iconCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('iconCtr'), this.icons); }
  get deviceCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('deviceCtr'), this.devices); }
  get templateCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('templateCtr'), this.templates); }
  get domainCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('domainCtr'), this.domains); }
  get folderCtr() { return this.nodeBulkEditForm.get('folderCtr'); }
  get parentFolderCtr() { return this.nodeBulkEditForm.get('parentFolderCtr'); }
  get roleCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('roleCtr'), ROLES); }
  get configTemplateCtr() { return this.nodeBulkEditForm.get('configTemplateCtr'); }
  get loginProfileCtr() { return this.helpers.getAutoCompleteCtr(this.nodeBulkEditForm.get('loginProfileCtr'), this.loginProfiles); }

  ngOnInit(): void {
    this.roleCtr.setValidators([autoCompleteValidator(this.ROLES)]);
    this.filteredRoles = this.helpers.filterOptions(this.roleCtr, this.ROLES);
    this.filteredTemplatesByDevice = this.templates.filter((template: any) => template.device_id == this.data.genData.device?.id);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.projectId = this.projectService.getProjectId();
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectConfigTemplates$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  private _updateNodeOnMap(data: any) {
    const ele = this.data.cy.getElementById('node-' + data.id);
    ele.data('icon', ICON_PATH + data.icon?.photo);
    ele.data('icon_id', data.icon?.id);
    ele.data('device', data.device);
    ele.data('device_id', data.device_id);
    ele.data('template', data.template);
    ele.data('template_id', data.template_id);
    ele.data('folder', data.folder);
    ele.data('parent_folder', data.parent_folder);
    ele.data('role', data.role);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('login_profile_id', data.login_profile_id);
    ele.data('login_profile_show', data.login_profile_show);
    ele.data('login_profile', data.login_profile?.name);
    ele.data('configs', data.configs);
    ele.data('configuration_show', data.configuration_show);
    ele.data('groups', data.groups);
  }

  updateNodeBulk() {
    const ids = this.data.genData.ids;
    const iconId = this.iconCtr?.value.id;
    const deviceId = this.deviceCtr?.value.id;
    const templateId = this.templateCtr?.value.id;
    const domainId = this.domainCtr?.value.id;
    const folder = this.folderCtr?.value !== '' ? this.folderCtr?.value : undefined;
    const parentFolder = this.parentFolderCtr?.value !== '' ? this.parentFolderCtr?.value : undefined;
    const role = this.roleCtr?.value.id;
    const configId = this.configTemplateCtr?.value;
    const loginProfileId = this.loginProfileCtr?.value.id;
    if (iconId || deviceId || templateId || domainId || folder || parentFolder || role || configId || loginProfileId) {
      const jsonDataValue = {
        ids: ids,
        icon_id: iconId,
        device_id: deviceId,
        template_id: templateId,
        domain_id: domainId,
        folder: folder,
        parent_folder: parentFolder,
        role: role,
        login_profile_id: loginProfileId
      }
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.store.dispatch(bulkEditNode({
        ids: ids,
        data: jsonData,
        configTemplate: this.configTemplateCtr?.value
      }));
    } else {
      this.dialogRef.close();
      this.toastr.info('You\'re not updating anything in the bulk edit nodes');
    }
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplatesByDevice = this.templates.filter((template: any) => template.device_id == $event.option.value.id);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
