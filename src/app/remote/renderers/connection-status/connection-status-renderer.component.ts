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
  selector: 'app-connection-status-renderer',
  templateUrl: './connection-status-renderer.component.html',
  styleUrls: ['./connection-status-renderer.component.scss']
})
export class ConnectionStatusRendererComponent implements ICellRendererAngularComp {
  status: any;
  constructor() { }

  agInit(params: ICellRendererParams): void {
    this.status= params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
