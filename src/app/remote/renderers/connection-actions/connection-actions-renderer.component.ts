import { Store } from "@ngrx/store";
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedServerConnect } from "../../../store/server-connect/server-connect.actions";
import { AddEditConnectionProfilesComponent } from "../../connection-profiles/add-edit-connection-profiles/add-edit-connection-profiles.component";

@Component({
  selector: 'app-connection-actions-renderer',
  templateUrl: './connection-actions-renderer.component.html',
  styleUrls: ['./connection-actions-renderer.component.scss']
})
export class ConnectionActionsRendererComponent implements ICellRendererAngularComp {
  id: any;
  constructor(
    private store: Store,
    private router: Router,
    private serverConnectService: ServerConnectService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  agInit(params: ICellRendererParams): void {
    this.id = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  openConnect () {
    this.serverConnectService.get(this.id).subscribe(data => {
      const dialogData = {
        mode: 'view',
        genData: data.result
      }
      const dialogRef = this.dialog.open(AddEditConnectionProfilesComponent, {
        width: '600px',
        data: dialogData
      });
    })
  }

  getUpdate() {
    this.serverConnectService.get(this.id).subscribe(data => {
      const dialogData = {
        mode: 'update',
        genData: data.result
      }
      const dialogRef = this.dialog.open(AddEditConnectionProfilesComponent, {
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    })
  }

  deleteConnection() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '450px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serverConnectService.delete(this.id).subscribe({
          next:(rest) => {
            this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
            this.toastr.success(`Deleted connection ${rest.result.name} successfully`);
          },
          error:(err) => {
            this.toastr.error(`Error while delete connection ${err.result.name}`);
          }
        });
      }
    });
  }
}
