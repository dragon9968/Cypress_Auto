import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { selectDeviceCategories } from 'src/app/store/device-category/device-category.selectors';
import { retrievedDevices } from 'src/app/store/device/device.actions';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { selectIcons } from 'src/app/store/icon/icon.selectors';

@Component({
  selector: 'app-add-edit-device-dialog',
  templateUrl: './add-edit-device-dialog.component.html',
  styleUrls: ['./add-edit-device-dialog.component.scss']
})
export class AddEditDeviceDialogComponent implements OnInit, OnDestroy {
  deviceForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectDeviceCategories$ = new Subscription();
  selectDevices$  = new Subscription();
  selectIcons$ = new Subscription();
  listDeviceCategory!: any[];
  deviceName!: any[];
  listIcon!: any[];
  listCategory: any[] = [];
  removeCategory: any[] = [];
  filteredIcons!: Observable<any[]>;
  ICON_PATH = ICON_PATH;

  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<AddEditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deviceForm = new FormGroup({
      name: new FormControl({value: '', disabled: false}, [Validators.required, validateNameExist(() => this.deviceName, data.mode, this.data.genData.id)]),
      category: new FormControl({value: '', disabled: false}),
      icon: new FormControl(''),
    });
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(data => {
      this.listDeviceCategory = data;
    })
    this.selectIcons$ = this.store.select(selectIcons).subscribe(icons => {
      this.listIcon = icons;
      this.filteredIcons = this.helpers.filterOptions(this.icon, this.listIcon);
    })

    this.selectDevices$ = this.store.select(selectDevices).subscribe((devicesData: any) => {
      this.deviceName = devicesData;
    });
    if (this.data) {
      this.name?.setValue(this.data.genData.name);
    }
   }

   get name() {return this.deviceForm.get('name')}
   get category() {return this.deviceForm.get('category')}
   get icon() { return this.helpers.getAutoCompleteCtr(this.deviceForm.get('icon'), this.listIcon); }

  ngOnInit(): void {
    if (this.data.mode == 'update') {
      if (this.data.genData.icon)
        this.helpers.setAutoCompleteValue(this.icon, this.listIcon, this.data.genData.icon.id);
      else {
        this.helpers.setAutoCompleteValue(this.icon, this.listIcon, '');
      }
        this.data.genData.category.forEach((el: any) => {
        this.listCategory.push(el);
        this.listDeviceCategory = this.listDeviceCategory.filter(value => value.id != el.id)
      });
    }
  }

  ngOnDestroy(): void {
    this.selectDeviceCategories$.unsubscribe();
    this.selectIcons$.unsubscribe();
  }

  addDevice() {
    const jsonData = {
      name: this.name?.value,
      category: this.category?.value,
      icon_id: this.icon?.value.id,
    }
    this.deviceService.add(jsonData).subscribe({
      next: (rest) => {
        this.dialogRef.close();
        this.toastr.success(`Add Device successfully`)
        this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
      },
      error: (err) => {
        this.toastr.error(`Error while add Device`);
      }
    });
  }

  updateDevice() {
    const categoryAdd = this.listCategory.map(el => el.name)
    const jsonData = {
      id: this.data.genData.id,
      name: this.name?.value,
      icon_id: this.icon?.value.id,
      category: this.category?.value,
    }
    this.deviceService.put(jsonData).subscribe({
      next: (rest) => {
        this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
        this.toastr.success(`Update Device successfully`)
        this.dialogRef.close();
      },
      error: (err) => {
        this.toastr.error(`Error while update Device`);
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  remove(category: any): void {
    const index = this.listCategory.indexOf(category);
    if (index >= 0) {
      this.listCategory.splice(index, 1);
      if ((this.data.mode === 'add') || (this.data.mode === 'update')) {
        this.listDeviceCategory.unshift(category)
      }
    }
  }

  selectDeviceCategory(event: MatAutocompleteSelectedEvent) {
    this.listCategory.push(event.option.value)
    Object.values(this.listCategory).forEach(val => {
      this.listDeviceCategory = this.listDeviceCategory.filter(value => value.id != val.id)
    });
  }

}
