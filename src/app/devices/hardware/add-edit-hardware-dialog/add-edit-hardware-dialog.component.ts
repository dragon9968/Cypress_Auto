import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { HardwareService } from 'src/app/core/services/hardware/hardware.service';
import { ToastrService } from 'ngx-toastr';
import { retrievedHardwares } from 'src/app/store/hardware/hardware.actions';
import { selectHardwares } from 'src/app/store/hardware/hardware.selectors';
import { validateNameExist } from "../../../shared/validations/name-exist.validation";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';

@Component({
  selector: 'app-add-edit-hardware-dialog',
  templateUrl: './add-edit-hardware-dialog.component.html',
  styleUrls: ['./add-edit-hardware-dialog.component.scss']
})
export class AddEditHardwareDialogComponent implements OnInit, OnDestroy {
  isViewMode = false;
  selected: any;
  errorMessages = ErrorMessages;
  hardwareForm!: FormGroup;
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectHardwares$ = new Subscription();
  listDevices!: any[];
  listTemplate!: any[];
  filteredTemplatesByDevice!: any[];
  hardwares: any[] = [];
  ICON_PATH = ICON_PATH;
  filteredDevices!: Observable<any[]>;
  filteredTemplates!: Observable<any[]>;

  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private hardwareService: HardwareService,
    public dialogRef: MatDialogRef<AddEditHardwareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.hardwareForm = new FormGroup({
      deviceCtr: new FormControl({value: '', disabled: this.isViewMode}),
      templateCtr: new FormControl({value: '', disabled: this.isViewMode}),
      serialNumberCtr: new FormControl({value: '', disabled: this.isViewMode},
        [Validators.required, validateNameExist(() => this.hardwares, this.data.mode, this.data.genData.id, 'serial_number')]),
      assetTagCtr: new FormControl({value: '', disabled: this.isViewMode}),
      firmwareCtr: new FormControl({value: '', disabled: this.isViewMode}),
    });
    this.selectDevices$ = this.store.select(selectDevices).subscribe((data: any) => {
      this.listDevices = data;
      this.deviceCtr.setValidators([Validators.required, autoCompleteValidator(this.listDevices)]);
      this.filteredDevices = this.helpers.filterOptions(this.deviceCtr, this.listDevices);
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((listTemplate: any) => {
      this.listTemplate = listTemplate;
      this.templateCtr.setValidators([Validators.required, autoCompleteValidator(this.listTemplate, 'display_name')]);
      this.filteredTemplates = listTemplate;
      this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    });
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe(
      hardwares => this.hardwares = hardwares
    );
  }

  ngOnInit(): void {
    this.filteredTemplatesByDevice = this.listTemplate.filter((template: any) => template.device_id == this.data.genData.device?.id);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.helpers.setAutoCompleteValue(this.deviceCtr, this.listDevices, this.data.genData.device?.id);
    this.helpers.setAutoCompleteValue(this.templateCtr, this.filteredTemplatesByDevice, this.data.genData.template?.id);
    this.serialNumberCtr?.setValue(this.data.genData.serial_number);
    this.assetTagCtr?.setValue(this.data.genData.asset_tag);
    this.firmwareCtr?.setValue(this.data.genData.firmware);
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectHardwares$.unsubscribe();
  }

  get deviceCtr() { return this.helpers.getAutoCompleteCtr(this.hardwareForm.get('deviceCtr'), this.listDevices); }
  get templateCtr() { return this.helpers.getAutoCompleteCtr(this.hardwareForm.get('templateCtr'), this.listTemplate); }
  get serialNumberCtr() { return this.hardwareForm.get('serialNumberCtr')};
  get assetTagCtr() { return this.hardwareForm.get('assetTagCtr')};
  get firmwareCtr() { return this.hardwareForm.get('firmwareCtr')};

  onCancel() {
    this.dialogRef.close();
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplatesByDevice = this.listTemplate.filter(template => template.device_id == $event.option.value.id);
    this.filteredTemplates = this.helpers.filterOptions(this.templateCtr, this.filteredTemplatesByDevice, 'display_name');
    this.templateCtr?.setValue('');
  }

  addHardware() {
    if (this.hardwareForm.valid) {
      const jsonDataValue = {
        device_id: this.deviceCtr?.value.id,
        template_id: this.templateCtr?.value.id,
        serial_number: this.serialNumberCtr?.value,
        asset_tag: this.assetTagCtr?.value,
        firmware: this.firmwareCtr?.value
      };
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.hardwareService.add(jsonData).subscribe({
        next: (rest) =>{
          this.toastr.success(`Add new Hardware successfully`);
          this.dialogRef.close();
          this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
        },
        error:(err) => {
          this.toastr.error(`Error while add Hardware`);
        }
      });
    }
  }

  updateHardware() {
    if (this.hardwareForm.valid) {
      const jsonDataValue = {
        device_id: this.deviceCtr?.value.id,
        template_id: this.templateCtr?.value.id,
        serial_number: this.serialNumberCtr?.value,
        asset_tag: this.assetTagCtr?.value,
        firmware: this.firmwareCtr?.value
      };
      const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.hardwareService.put(this.data.genData.id, jsonData).subscribe({
        next: (rest) =>{
          this.toastr.success(`Update Hardware successfully`);
          this.dialogRef.close();
          this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
        },
        error:(err) => {
          this.toastr.error(`Error while update Hardware`);
        }
      });
    }
  }

  changeViewToEdit() {
    this.data.mode = 'edit';
    this.isViewMode = false;
    this.deviceCtr?.enable();
    this.templateCtr?.enable();
    this.serialNumberCtr?.enable();
    this.assetTagCtr?.enable();
    this.firmwareCtr?.enable();
  }
}

