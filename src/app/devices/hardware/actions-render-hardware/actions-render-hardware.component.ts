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
        this.isLoading = true;
        this.nodeService.getAll().subscribe(data => {
          const nodes = data.result;
          const isAssociateHardware = nodes.some((ele: any) => ele.hardware_id === this.id);
          if (isAssociateHardware) {
            this.toastr.error('There are nodes still associate with this hardware device. ' +
                              'Please remove the association before deleting.', 'Error');
            this.isLoading = false;
          } else {
            this.hardwareService.delete(this.id).subscribe({
              next: (rest) => {
                this.hardwareService.getAll().subscribe((data: any) => this.store.dispatch(retrievedHardwares({data: data.result})));
                this.toastr.success(`Delete Hardware successfully`);
              },
              error: (error) => {
                this.toastr.error(`Error while delete Hardware`);
              }
            })
          }
          this.isLoading = false;
        })
      }
    });
  }
}
