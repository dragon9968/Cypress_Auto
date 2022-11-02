import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params } from "@angular/router";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subscription, throwError } from "rxjs";
import { FormControl, FormGroup, UntypedFormControl } from "@angular/forms";
import { ROLES } from "../../../shared/contants/roles.constant";
import { ICON_PATH } from "src/app/shared/contants/icon-path.constant";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { NodeService } from "../../../core/services/node/node.service";
import { IconService } from "../../../core/services/icon/icon.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { retrievedNode } from "../../../store/node/node.actions";
import { selectIcons } from "../../../store/icon/icon.selectors";
import { selectDevices } from "../../../store/device/device.selectors";
import { selectTemplates } from "../../../store/template/template.selectors";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { selectConfigTemplates } from "../../../store/config-template/config-template.selectors";
import { selectLoginProfiles } from "../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../shared/validations/auto-complete.validation";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";

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
  configTemplateCtr = new UntypedFormControl();
  configTemplatesFilterCtrl = new UntypedFormControl();
  filteredConfigTemplates: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NodeBulkEditDialogComponent>,
    public helpers: HelpersService,
    private nodeService: NodeService,
    private iconService: IconService,
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
      roleCtr: new FormControl('', [autoCompleteValidator(ROLES)]),
      loginProfileCtr: new FormControl('', [autoCompleteValidator(this.loginProfiles)]),
    })
  }

  get iconCtr() { return this.nodeBulkEditForm.get('iconCtr'); }

  get deviceCtr() { return this.nodeBulkEditForm.get('deviceCtr'); }

  get templateCtr() { return this.nodeBulkEditForm.get('templateCtr'); }

  get domainCtr() { return this.nodeBulkEditForm.get('domainCtr'); }

  get folderCtr() { return this.nodeBulkEditForm.get('folderCtr'); }

  get roleCtr() { return this.nodeBulkEditForm.get('roleCtr'); }

  get loginProfileCtr() { return this.nodeBulkEditForm.get('loginProfileCtr'); }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => this.collectionId = params['collection_id'])
    this.filteredConfigTemplates.next(this.configTemplates.slice());
    this.configTemplatesFilterCtrl.valueChanges.subscribe(() => {
      this.filterConfigTemplates();
    });
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
      role: this.roleCtr?.value.id,
      login_profile_id: this.loginProfileCtr?.value.id
    }
    this.nodeService.editBulk(jsonData).subscribe(response => {
      this.data.genData.ids.map((nodeId: any) => {
        this.nodeService.get(nodeId).subscribe(nodeData => {
          const ele = this.data.cy.getElementById('node-' + nodeId);
          ele.data('groups', nodeData.result.groups);
          ele.data('icon', ICON_PATH + nodeData.result.icon.photo);
          if (this.configTemplateCtr?.value) {
            const configData = {
              pk: nodeData.id,
              config_ids: this.configTemplateCtr?.value.map((item: any) => item.id)
            }
            this.nodeService.associate(configData).subscribe(respData => {
              this.store.dispatch(retrievedMapSelection({ data: true }));
            });
          }
        });
      });
      this.helpers.reloadGroupBoxes(this.data.cy);
      this.toastr.success(response.message, 'Success');
      this.dialogRef.close();
      this.store.dispatch(retrievedMapSelection({ data: true }));
    });
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.templates.filter((template: any) => template.device_id == $event.option.value.id);
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }

  filterConfigTemplates() {
    if (!this.configTemplates) {
      return;
    }
    let search = this.configTemplatesFilterCtrl.value;
    if (!search && search !== "") {
      this.filteredConfigTemplates.next(this.configTemplates.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredConfigTemplates.next(
      this.configTemplates.filter((configTemplate) => configTemplate.name.toLowerCase().indexOf(search) > -1)
    );
  }
}
