import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HardwareService } from 'src/app/core/services/hardware/hardware.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedHardwares } from 'src/app/store/hardware/hardware.actions';
import { AddEditHardwareDialogComponent } from '../add-edit-hardware-dialog/add-edit-hardware-dialog.component';
import { NodeService } from "../../../core/services/node/node.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: 'app-actions-render-hardware',
  templateUrl: './actions-render-hardware.component.html',
  styleUrls: ['./actions-render-hardware.component.scss']
})
export class ActionsRenderHardwareComponent implements ICellRendererAngularComp {
  id: any;
  isLoading = false;
  constructor (
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private store: Store,
    private nodeService: NodeService,
    private hardwareService: HardwareService,
  ) { }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  openHardware() {
    this.hardwareService.get(this.id).subscribe(hardwareData => {
      const dialogData = {
        mode: 'view',
        genData: hardwareData.result
      }
      const dialogRef = this.dialog.open(AddEditHardwareDialogComponent, {
        width: '450px',
        data: dialogData
      });
    })
  }

  updateHardware() {
    this.hardwareService.get(this.id).subscribe(hardwareData => {
      const dialogData = {
        mode: 'update',
        genData: hardwareData.result
      }
      const dialogRef = this.dialog.open(AddEditHardwareDialogComponent, {
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  deleteHardware() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hardwareService.delete(this.id).pipe(
          catchError((response: any) => {
            if (response.status == 400) {
              const message = response.error.message.split(':')[1];
              this.toastr.warning(message, 'Warning');
            } else {
              this.toastr.error('Delete hardware failed', 'Error');
            }
            return throwError(() => response.error);
          })
        ).subscribe(() => {
          this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
          this.toastr.success(`Deleted hardware successfully`, 'Success');
        })
      }
    });
  }
}
