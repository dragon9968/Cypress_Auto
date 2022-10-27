import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { retrievedDevices } from 'src/app/store/device/device.actions';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { retrievedTemplates } from 'src/app/store/template/template.actions';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { HardwareService } from 'src/app/core/services/hardware/hardware.service';
import { ToastrService } from 'ngx-toastr';
import { retrievedHardwares } from 'src/app/store/hardware/hardware.actions';
import { selectHardwares } from 'src/app/store/hardware/hardware.selectors';

@Component({
  selector: 'app-add-edit-hardware-dialog',
  templateUrl: './add-edit-hardware-dialog.component.html',
  styleUrls: ['./add-edit-hardware-dialog.component.scss']
})
export class AddEditHardwareDialogComponent implements OnInit {
  isDisable = true;
  isViewMode = false;
  selected: any;
  hardwareForm!: FormGroup;
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectHardwares$ = new Subscription();
  listDevices!: any[];
  listTemplate!: any[];
  filteredTemplates!: any[];
  serialNumberHardware!: any[];
  ICON_PATH = ICON_PATH;
  constructor(
    private store: Store,
    public helpers: HelpersService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private deviceService: DeviceService,
    private templateService: TemplateService,
    private hardwareService: HardwareService,
    public dialogRef: MatDialogRef<AddEditHardwareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.selectDevices$ = this.store.select(selectDevices).subscribe((data: any) => {
      this.listDevices = data;
    });

    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((listTemplate: any) => {
      this.listTemplate = listTemplate;
      this.filteredTemplates = listTemplate;
    });

    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((serialNumberHardware: any[]) => {
      this.serialNumberHardware = serialNumberHardware;
    });
    this.isViewMode = this.data.mode == 'view';
    this.hardwareForm = new FormGroup({
      device: new FormControl({value: '', disabled: this.isViewMode}),
      template: new FormControl({value: '', disabled: this.isViewMode}),
      serialNumber: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required, this._existsSerialNumber(() => this.serialNumberHardware, this.data.mode, this.data.genData.id)]),
      assetTag: new FormControl({value: '', disabled: this.isViewMode})
    });
    if (this.data) {
      this.device?.setValue(this.data.genData.device);
      this.template?.setValue(this.data.genData.template);
      this.serialNumber?.setValue(this.data.genData.serial_number);
      this.assetTag?.setValue(this.data.genData.asset_tag);
    }
  }

  private _existsSerialNumber(getData: () => any[], mode: string, id: any): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const serialNumberValue = control.value;
        if (serialNumberValue == undefined || typeof serialNumberValue !== 'string' || serialNumberValue == '') {
          return null;
        }
        let data: any[] = [...getData()];
        if (mode === 'update') {
          const index = data.findIndex(ele => ele.id === id);
          data.splice(index, 1);
        }
        const isExistSerialNumber = data.some((ele: any) => ele.serial_number === serialNumberValue);
        return isExistSerialNumber ? {isExist: true} : null;
    }
  }

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
    this.templateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedTemplates({data: data.result})));
    this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectHardwares$.unsubscribe();
  }

  get device() { return this.hardwareForm.get('device')};
  get template() { return this.hardwareForm.get('template')};
  get serialNumber() { return this.hardwareForm.get('serialNumber')};
  get assetTag() { return this.hardwareForm.get('assetTag')};

  onCancel() {
    this.dialogRef.close();
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.isDisable = false;
    this.filteredTemplates = this.listTemplate.filter(template => template.device_id == $event.option.value.id);
    this.template?.setValue('');
  }

  addHardware() {
    if (this.hardwareForm.valid) {
      const jsonData = {
        device_id: this.device?.value.id,
        template_id: this.template?.value.id,
        serial_number: this.serialNumber?.value,
        asset_tag: this.assetTag?.value
      }
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
      const jsonData = {
        device_id: this.device?.value.id,
        template_id: this.template?.value.id,
        serial_number: this.serialNumber?.value,
        asset_tag: this.assetTag?.value
      };
      this.hardwareService.update(this.data.genData.id, jsonData).subscribe({
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
}
