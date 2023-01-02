import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { forkJoin, map, of, Subscription } from "rxjs";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ROLES } from "../../../shared/contants/roles.constant";
import { ICON_PATH } from "src/app/shared/contants/icon-path.constant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { selectIcons } from "../../../store/icon/icon.selectors";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { selectDevices } from "../../../store/device/device.selectors";
import { selectTemplates } from "../../../store/template/template.selectors";
import { selectLoginProfiles } from "../../../store/login-profile/login-profile.selectors";
import { selectConfigTemplates } from "../../../store/config-template/config-template.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";

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
  filteredTemplates!: any[];
  collectionId = '0';
  selectIcons$ = new Subscription();
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectDomains$ = new Subscription();
  selectConfigTemplates$ = new Subscription();
  selectLoginProfiles$ = new Subscription();

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NodeBulkEditDialogComponent>,
    public helpers: HelpersService,
    private nodeService: NodeService,
  ) {
    this.selectIcons$ = this.store.select(selectIcons).subscribe(icons => this.icons = icons);
    this.selectDevices$ = this.store.select(selectDevices).subscribe(devices => this.devices = devices);
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe(templates => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => this.domains = domains);
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe(
      configTemplates => this.configTemplates = configTemplates
    );
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(
      loginProfiles => this.loginProfiles = loginProfiles
    );
    this.nodeBulkEditForm = new FormGroup({
      iconCtr: new FormControl('', [autoCompleteValidator(this.icons)]),
      deviceCtr: new FormControl('', [autoCompleteValidator(this.devices)]),
      templateCtr: new FormControl('', [autoCompleteValidator(this.templates, 'display_name')]),
      domainCtr: new FormControl('', [autoCompleteValidator(this.domains)]),
      folderCtr: new FormControl(''),
      parentFolderCtr: new FormControl(''),
      roleCtr: new FormControl('', [autoCompleteValidator(ROLES)]),
      configTemplateCtr: new FormControl(''),
      loginProfileCtr: new FormControl('', [autoCompleteValidator(this.loginProfiles)]),
    })
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
    this.filteredTemplates = this.templates.filter((template: any) => template.device_id == this.data.genData.device?.id);
    this.route.queryParams.subscribe((params: Params) => this.collectionId = params['collection_id']);
  }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectConfigTemplates$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
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
      const jsonData = {
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
      this.nodeService.editBulk(jsonData).subscribe(response => {
        return forkJoin(this.data.genData.activeNodes.map((node: any) => {
          if (configId) {
            const configData = {
              pk: node.node_id,
              config_ids: configId
            }
            return this.nodeService.associate(configData).pipe(map(respData => {}));
          }
          return of([]);
        }))
          .subscribe(() => {
            return forkJoin(this.data.genData.activeNodes.map((node: any) => {
              return this.nodeService.get(node.node_id).pipe(map(nodeData => {
                this._updateNodeOnMap(nodeData.result);
              }));
            }))
              .subscribe(() => {
                this.helpers.reloadGroupBoxes(this.data.cy);
                this.dialogRef.close();
                this.store.dispatch(retrievedMapSelection({ data: true }));
                this.toastr.success(response.message, 'Success');
              });
          });
      });
    } else {
      this.dialogRef.close();
      this.toastr.info('You\'re not updating anything in the bulk edit nodes');
    }
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.templates.filter((template: any) => template.device_id == $event.option.value.id);
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
