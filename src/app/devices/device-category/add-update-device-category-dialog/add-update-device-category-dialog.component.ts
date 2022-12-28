import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ErrorMessages } from "../../../shared/enums/error-messages.enum";
import { validateNameExist } from "../../../shared/validations/name-exist.validation";
import { DeviceCategoryService } from "../../../core/services/device-category/device-category.service";
import { selectDeviceCategories } from "../../../store/device-category/device-category.selectors";
import { retrievedDeviceCategories } from "../../../store/device-category/device-category.actions";

@Component({
  selector: 'app-add-update-device-category-dialog',
  templateUrl: './add-update-device-category-dialog.component.html',
  styleUrls: ['./add-update-device-category-dialog.component.scss']
})
export class AddUpdateDeviceCategoryDialogComponent implements OnInit, OnDestroy {

  deviceCategoryForm: FormGroup;
  errorMessage = ErrorMessages;
  selectDeviceCategories$ = new Subscription();
  deviceCategories!: any[];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddUpdateDeviceCategoryDialogComponent>,
    private deviceCategoryService: DeviceCategoryService
  ) {
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(deviceCategories => {
      this.deviceCategories = deviceCategories;
    });
    this.deviceCategoryForm = new FormGroup({
      nameCtr: new FormControl(
        '',
        [Validators.required, validateNameExist(() => this.deviceCategories, this.data.mode, this.data.genData.id)])
    })
  }

  get nameCtr() { return this.deviceCategoryForm.get('nameCtr'); };

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
  }

  ngOnDestroy(): void {
    this.selectDeviceCategories$.unsubscribe();
  }

  addDeviceCategory() {
    const jsonData = {
      name: this.nameCtr?.value
    }
    this.deviceCategoryService.add(jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(`Add device category failed!`);
        return throwError(() => error);
      })
    ).subscribe(response => {
      this.toastr.success(`Added device category ${response.result.name} successfully`, 'Success');
      this.deviceCategoryService.getAll().subscribe(response => {
        this.store.dispatch(retrievedDeviceCategories({data: response.result}));
      });
      this.dialogRef.close();
    })
  }

  editDeviceCategory() {
    const jsonData = {
      name: this.nameCtr?.value
    }
    this.deviceCategoryService.put(this.data.genData.id, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(`Edit device category failed due to ${error.messages}`, 'Error');
        return throwError(() => error);
      })
    ).subscribe(response => {
      this.toastr.success(`Changed device category name from ${this.data.genData.name} to ${response.result.name}`, 'Success');
      this.deviceCategoryService.getAll().subscribe(response => {
        this.store.dispatch(retrievedDeviceCategories({data: response.result}));
      });
      this.dialogRef.close();
    });
  }
}
