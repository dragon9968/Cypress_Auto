import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-connection-actions-renderer',
  templateUrl: './connection-actions-renderer.component.html',
  styleUrls: ['./connection-actions-renderer.component.scss']
})
export class ConnectionActionsRendererComponent implements ICellRendererAngularComp {
  id: any;
  constructor(
    private router: Router,
    private serverConnectService: ServerConnectService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  agInit(params: ICellRendererParams): void {
    this.id= params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
  getId () {
    this.router.navigateByUrl(RouteSegments.REMOTE + "/connection-profiles/show/" + this.id);
  }

  getUpdate() {
    this.router.navigateByUrl(RouteSegments.REMOTE + "/connection-profiles/edit/" + this.id);
  }

  deleteConnection() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '600px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serverConnectService.delete(this.id).subscribe({
          next:(rest) => {
            this.router.navigate([RouteSegments.CONNECTION_PROFILES]).then(() => {
              window.location.reload();
            });
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