import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DeviceCategoryService } from 'src/app/core/services/device-category/device-category.service';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { IconService } from 'src/app/core/services/icon/icon.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedDeviceCategories } from 'src/app/store/device-category/device-category.actions';
import { selectDeviceCategories } from 'src/app/store/device-category/device-category.selectors';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
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
  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private deviceService: DeviceService,
    public dialogRef: MatDialogRef<AddEditDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(data => {
      this.listDeviceCategory = data;
    })
    this.selectIcons$ = this.store.select(selectIcons).subscribe(icons => {
      this.listIcon = icons;
    })

    this.selectDevices$ = this.store.select(selectDevices).subscribe((devicesData: any) => {
      this.deviceName = devicesData;
    });

    this.deviceForm = new FormGroup({
      name: new FormControl({value: '', disabled: false}, [Validators.required, validateNameExist(() => this.deviceName, data.mode, this.data.genData.id)]),
      category: new FormControl({value: '', disabled: false}),
      icon: new FormControl(''),
    })
    if (this.data) {
      this.name?.setValue(this.data.genData.name);
    }
   }
  
   get name() {return this.deviceForm.get('name')}
   get category() {return this.deviceForm.get('category')}
   get icon() { return this.helpers.getAutoCompleteCtr(this.deviceForm.get('icon'), this.listIcon); }

  ngOnInit(): void {
    if (this.data.mode == 'update') {
      this.helpers.setAutoCompleteValue(this.icon, this.listIcon, this.data.genData.icon.id);
      this.data.genData.category.forEach((el: any) => {
        this.listCategory.push(el)
      });
    } else {
      this.helpers.setAutoCompleteValue(this.icon, this.listIcon, '');
    }
  }

  ngOnDestroy(): void {
    this.selectDeviceCategories$.unsubscribe();
    this.selectIcons$.unsubscribe();
  }

  addDevice() {
    const categoryAdd = this.listCategory.map(el => el.name)
    const jsonData = {
      name: this.name?.value,
      category: categoryAdd,
      icon_id: this.icon?.value.id,
    }
    this.deviceService.add(jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Add Device successfully`)
        this.dialogRef.close();
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
      category: categoryAdd,
    }
    this.deviceService.put(jsonData).subscribe({
      next: (rest) => {
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
      if (this.data.mode === 'add') {
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
