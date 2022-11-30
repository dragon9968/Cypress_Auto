import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { forkJoin, map, Subscription } from "rxjs";
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
import { retrievedMapEdit } from "src/app/store/map-edit/map-edit.actions";
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

  updateNodeBulk() {
    const jsonData = {
      ids: this.data.genData.ids,
      icon_id: this.iconCtr?.value.id,
      device_id: this.deviceCtr?.value.id,
      template_id: this.templateCtr?.value.id,
      domain_id: this.domainCtr?.value.id,
      folder: this.folderCtr?.value,
      parent_folder: this.parentFolderCtr?.value,
      role: this.roleCtr?.value.id,
      login_profile_id: this.loginProfileCtr?.value.id
    }
    this.nodeService.editBulk(jsonData).subscribe(response => {
      const nodeEditedData: any[] = [];
      return forkJoin(this.data.genData.ids.map((nodeId: any) => {
        return this.nodeService.get(nodeId).pipe(map(nodeData => {
          const ele = this.data.cy.getElementById('node-' + nodeId);
          const result = nodeData.result;
          ele.data('groups', result.groups);
          ele.data('icon', ICON_PATH + result.icon.photo);
          nodeEditedData.push({
            id: result.id,
            name: result.name,
            category: result.category,
            role: result.role,
            device: result.device.name,
            template: result.template.display_name,
            hardware: result.hardware?.serial_number,
            folder: result.folder,
            domain: result.domain.name,
            interfaces: result.interfaces,
            configuration_show: result.configuration_show,
            login_profile_show: result.login_profile_show,
          });
          if (this.configTemplateCtr?.value) {
            const configData = {
              pk: nodeData.id,
              config_ids: this.configTemplateCtr?.value
            }
            this.nodeService.associate(configData).subscribe(respData => {
              this.store.dispatch(retrievedMapSelection({ data: true }));
            });
          }
        }));
      }))
        .subscribe(() => {
          this.helpers.reloadGroupBoxes(this.data.cy);
          this.store.dispatch(retrievedMapEdit({ data: { nodeEditedData } }));
          this.store.dispatch(retrievedMapSelection({ data: true }));
          this.dialogRef.close();
          this.toastr.success(response.message, 'Success');
        });
    });
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.templates.filter((template: any) => template.device_id == $event.option.value.id);
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
