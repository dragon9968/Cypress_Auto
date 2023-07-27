import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { OSFirmwareModel } from "../../../../core/models/os-firmware.model";
import { ToastrService } from "ngx-toastr";
import { Store } from "@ngrx/store";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { selectLookupOSFirmwares } from "../../../../store/lookup-os-firmware/lookup-os-firmwares.selectors";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { OS_FIRMWARE_CATEGORIES } from "../../../../shared/contants/os-firmware-categories.constant";
import { addNewOSFirmware, updateOSFirmware } from "../../../../store/lookup-os-firmware/lookup-os-firmwares.actions";
import { selectNotification } from "../../../../store/app/app.selectors";

@Component({
  selector: 'app-add-edit-lookup-os-firmware-dialog',
  templateUrl: './add-edit-lookup-os-firmware-dialog.component.html',
  styleUrls: ['./add-edit-lookup-os-firmware-dialog.component.scss']
})
export class AddEditLookupOsFirmwareDialogComponent implements OnInit, OnDestroy {

  isViewMode = false;
  errorMessages = ErrorMessages;
  lookupOSFirmwareForm!: FormGroup;
  selectLookupOSFirmwares$ = new Subscription();
  selectNotification$ = new Subscription();
  osFirmwares: OSFirmwareModel[] = []
  OS_FIRMWARE_CATEGORIES = OS_FIRMWARE_CATEGORIES;
  filteredOSFirmwareCategories!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddEditLookupOsFirmwareDialogComponent>,
    public helpersService: HelpersService,
  ) {
    this.isViewMode = this.data.mode === 'view'
    this.lookupOSFirmwareForm = new FormGroup({
      nameCtr: new FormControl({ value: '', disabled: this.isViewMode }, [Validators.required]),
      categoryCtr: new FormControl({ value: '', disabled: this.isViewMode }, [Validators.required]),
      versionCtr: new FormControl({ value: '', disabled: this.isViewMode }, [Validators.required])
    })
    this.selectLookupOSFirmwares$ = this.store.select(selectLookupOSFirmwares).subscribe(osFirmwares => {
      this.osFirmwares = osFirmwares
    })
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close()
      }
    });
    this.filteredOSFirmwareCategories = this.helpersService.filterOptions(this.categoryCtr, this.OS_FIRMWARE_CATEGORIES);
  }

  get nameCtr() { return this.lookupOSFirmwareForm.get('nameCtr') }
  get categoryCtr() {
    return this.helpersService.getAutoCompleteCtr(this.lookupOSFirmwareForm.get('categoryCtr'), this.osFirmwares)
  }
  get versionCtr() { return this.lookupOSFirmwareForm.get('versionCtr') }

  ngOnInit(): void {
    if (this.data.genData.mode !== 'add') {
      this.nameCtr?.setValue(this.data.genData.name)
      this.categoryCtr?.setValue(this.OS_FIRMWARE_CATEGORIES[0]);
      this.versionCtr?.setValue(this.data.genData.version)
    } else {
      this.helpersService.setAutoCompleteValue(
        this.categoryCtr,
        this.osFirmwares,
        this.data.genData.category
      )
    }
  }

  ngOnDestroy(): void {
    this.selectLookupOSFirmwares$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  addNewOSFirmware() {
    const jsonDataValue: OSFirmwareModel = {
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      version: this.versionCtr?.value
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue)
    this.store.dispatch(addNewOSFirmware({ newOSFirmware: jsonData }))
  }

  updateLookupOSFirmware() {
    const jsonDataValue: OSFirmwareModel = {
      id: this.data.genData.id,
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value.id,
      version: this.versionCtr?.value
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue)
    this.store.dispatch(updateOSFirmware({ osFirmware: jsonData }))
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.nameCtr?.enable();
    this.categoryCtr?.enable();
    this.versionCtr?.enable();
    this.helpersService.setAutoCompleteValue(
      this.categoryCtr,
      this.OS_FIRMWARE_CATEGORIES,
      this.data.genData.category
    );
  }
}
