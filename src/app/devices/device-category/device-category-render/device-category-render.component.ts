import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError, takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { Subject, Subscription, throwError } from "rxjs";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { selectDeviceCategories } from "../../../store/device-category/device-category.selectors";
import { retrievedDeviceCategories } from "../../../store/device-category/device-category.actions";
import { DeviceCategoryService } from "../../../core/services/device-category/device-category.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateDeviceCategoryDialogComponent } from "../add-update-device-category-dialog/add-update-device-category-dialog.component";

@Component({
  selector: 'app-device-category-render',
  templateUrl: './device-category-render.component.html',
  styleUrls: ['./device-category-render.component.scss']
})
export class DeviceCategoryRenderComponent implements OnInit, ICellRendererAngularComp, OnDestroy {

  id!: number;
  selectDeviceCategories$ = new Subscription();
  deviceCategories!: any[];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private deviceCategoryService: DeviceCategoryService
  ) {
    this.selectDeviceCategories$ = this.store.select(selectDeviceCategories).subscribe(deviceCategories => {
      this.deviceCategories = deviceCategories;
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectDeviceCategories$.unsubscribe();
  }

  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  editDeviceCategory() {
    const deviceCategory = this.deviceCategories.find(ele => ele.id === this.id);
    const dialogData = {
      mode: 'update',
      genData: deviceCategory
    };
    this.dialog.open(AddUpdateDeviceCategoryDialogComponent, {width: '500px', data: dialogData});
  }

  deleteCategory() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRefConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
    dialogRefConfirm.afterClosed().subscribe(confirm => {
      if (confirm) {
        const deviceCategory = this.deviceCategories.find(ele => ele.id === this.id);
        this.deviceCategoryService.deleteDeviceCategory(this.id).pipe(
          catchError((response: any) => {
            if (response.status === 400) {
              const message = response.error.message.split(':')[1].split('.');
              const messageContent = message[1];
              const title = message[0];
              this.toastr.warning(messageContent, title);
            } else {
              this.toastr.error('Delete device category failed!')
            }
            return throwError(response.error);
          })
        ).subscribe(response => {
          this.toastr.success(`Deleted device category ${ deviceCategory.name }`, 'Success');
          this.deviceCategoryService.getAllDeviceCategory().subscribe(response => {
            this.store.dispatch(retrievedDeviceCategories({data: response.result}));
          });
        })
      }
    })
  }
}
