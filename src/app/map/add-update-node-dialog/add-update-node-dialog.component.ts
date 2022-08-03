import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ROLES } from 'src/app/shared/contants/roles.contant';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
import { NodeService } from 'src/app/core/services/node/node.service';

@Component({
  selector: 'app-add-update-node-dialog',
  templateUrl: './add-update-node-dialog.component.html',
  styleUrls: ['./add-update-node-dialog.component.scss']
})
export class AddUpdateNodeDialogComponent implements OnInit {
  nodeAddForm: FormGroup;
  ROLES = ROLES;
  filteredTemplates!: any[];
  errorMessages = ErrorMessages;

  constructor(
    private nodeService: NodeService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
  ) {
    this.filteredTemplates = this.data.templates;
    this.nodeAddForm = new FormGroup({
      nameCtr: new FormControl('', Validators.required),
      notesCtr: new FormControl(''),
      iconCtr: new FormControl('', [autoCompleteValidator(this.data.icons)]),
      categoryCtr: new FormControl(''),
      deviceCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.devices)]),
      templateCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.templates, 'display_name')]),
      hardwareCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.hardwares)]),
      folderCtr: new FormControl('', Validators.required),
      roleCtr: new FormControl('', [Validators.required, autoCompleteValidator(ROLES)]),
      domainCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.domains)]),
      hostnameCtr: new FormControl('', Validators.required),
      configTemplateCtr: new FormControl('', [autoCompleteValidator(this.data.configTemplates)]),
      loginProfileCtr: new FormControl('', [autoCompleteValidator(this.data.loginProfiles)]),
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
      this.nameCtr?.setValue(this.data.genData.name);
      this.iconCtr?.setValue(this.helpers.getOptionById(this.data.icons, this.data.genData.icon_id));
      this.categoryCtr?.setValue(this.data.genData.category);
      this.deviceCtr?.setValue(this.helpers.getOptionById(this.data.devices, this.data.genData.device_id));
      this.templateCtr?.setValue(this.helpers.getOptionById(this.data.templates, this.data.genData.template_id));
      this.folderCtr?.setValue(this.data.genData.folder);
      this.roleCtr?.setValue(this.helpers.getOptionById(ROLES, this.data.genData.role));
      this.domainCtr?.setValue(this.helpers.getOptionById(this.data.domains, this.data.genData.domain_id));
      this.hostnameCtr?.setValue(this.data.genData.hostname);
      this.loginProfileCtr?.setValue(this.helpers.getOptionById(this.data.loginProfiles, this.data.genData.login_profile_id));
      this.disableItems(this.categoryCtr?.value);
    } else if (this.data.mode == 'update') {
    }
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
        this.helpers.addCYNode(this.data.cy, { newNodeData: { ...this.data.newNodeData, ...cyData }, newNodePosition: this.data.newNodePosition });
        this.helpers.reloadGroupBoxes(this.data.cy, this.data.groupBoxes, this.data.groupCategoryId, this.data.isGroupBoxesChecked);
        this.toastr.success('Node details added!');
      })
      this.dialogRef.close();
    });
  }

  updateNode() {
    console.log('updateNode');
  }
}
