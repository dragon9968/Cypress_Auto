import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedDevices } from 'src/app/store/device/device.actions';
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
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deviceService.delete(this.id).subscribe({
          next: (rest) => {
            this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
            this.toastr.success(`Delete Device successfully`);
          },
          error: (error) => {
            this.toastr.error(`Error while delete Device`);
          }
        })
      }
    });
  }

}
