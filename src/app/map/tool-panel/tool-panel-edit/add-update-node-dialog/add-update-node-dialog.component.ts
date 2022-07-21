import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ROLES } from 'src/app/shared/contants/roles.contant';
import { HelpersService } from 'src/app/shared/services/helper/helpers.service';
import { NodeService } from 'src/app/shared/services/node/node.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-update-node-dialog',
  templateUrl: './add-update-node-dialog.component.html',
  styleUrls: ['./add-update-node-dialog.component.scss']
})
export class AddUpdateNodeDialogComponent implements OnInit, OnDestroy {
  nodeAddForm: FormGroup;
  icons!: any[];
  devices!: any[];
  templates!: any[];
  hardwares!: any[];
  ROLES = ROLES;
  domains!: any[];
  configTemplates!: any[];
  loginProfiles!: any[];
  filteredTemplates!: any[];
  errorMessages = ErrorMessages;

  constructor(
    public dialogRef: MatDialogRef<AddUpdateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helper: HelpersService,
    private nodeService: NodeService,
  ) {
    this.icons = this.data.icons;
    this.devices = this.data.devices;
    this.templates = this.data.templates;
    this.filteredTemplates = this.data.templates;
    this.hardwares = this.data.hardwares;
    this.domains = this.data.domains;
    this.configTemplates = this.data.configTemplates;
    this.loginProfiles = this.data.loginProfiles;
    this.nodeAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      notesCtr: new FormControl(''),
      iconCtr: new FormControl('', [autoCompleteValidator(this.icons)]),
      categoryCtr: new FormControl(''),
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
    if (this.data.mode == 'add') {
      this.nodeService.getGenNodeData(
        this.data.collectionId,
        this.data.device,
        this.data.template
      ).subscribe(genData => {
        this.nameCtr?.setValue(genData.name);
        this.iconCtr?.setValue(genData.icon);
        this.categoryCtr?.setValue(genData.category);
        this.deviceCtr?.setValue(genData.device);
        this.templateCtr?.setValue(genData.template);
        this.folderCtr?.setValue(genData.folder);
        this.roleCtr?.setValue(ROLES.filter(role => role.id == genData.role)[0]);
        this.domainCtr?.setValue(genData.domain);
        this.hostnameCtr?.setValue(genData.hostname);
        this.disableItems(this.categoryCtr?.value);
      })
    } else {
    }
  }

  ngOnDestroy(): void {}

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
    this.filteredTemplates = this.templates.filter(template => template.device_id == $event.option.value.id);
    this.templateCtr?.setValue('');
  }

  onCancel() {
    this.dialogRef.close();
  }

  addNode() {
    console.log('addNode');
    this.dialogRef.close();
  }

  updateNode() {
    console.log('updateNode');
  }
}
