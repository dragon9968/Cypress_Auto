import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { ICellRendererParams } from 'ag-grid-community';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { retrievedDevices } from 'src/app/store/device/device.actions';
import { retrievedIsDeviceChange } from "../../../store/device-change/device-change.actions";
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AddEditDeviceDialogComponent } from '../add-edit-device-dialog/add-edit-device-dialog.component';

@Component({
  selector: 'app-action-render-device',
  templateUrl: './action-render-device.component.html',
  styleUrls: ['./action-render-device.component.scss']
})
export class ActionRenderDeviceComponent implements ICellRendererAngularComp {
  id: any;
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private store: Store,
    private deviceService: DeviceService,
  ) { }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  updateDevice() {
    this.deviceService.get(this.id).subscribe(deviceData => {
      const dialogData = {
        mode: 'update',
        genData: deviceData.result
      }
      const dialogRef = this.dialog.open(AddEditDeviceDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  deleteDevice() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Are you sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.delete(this.id).pipe(
          catchError(response => {
            if (response.status == 400) {
              const messages = response.error.message.split(':')[1];
              this.toastr.warning(messages, 'Warning');
            } else {
              this.toastr.error('Delete device failed', 'Error');
            }
            return throwError(() => response.error);
          })
        ).subscribe(response => {
          this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
          this.store.dispatch(retrievedIsDeviceChange({data: true}));
          this.toastr.success('Deleted device successfully', 'Success');
        })
      }
    });
  }

}
