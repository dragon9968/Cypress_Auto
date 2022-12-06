import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { interval, Subject, Subscription, takeUntil, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MapService } from "../../../core/services/map/map.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../core/services/server-connect/server-connect.service";
import { ServerConnectDialogComponent } from "./server-connect-dialog/server-connect-dialog.component";
import { retrievedVMStatus } from "../../../store/project/project.actions";
import { retrievedIsConnect } from "../../../store/server-connect/server-connect.actions";
import { selectVMStatus } from "../../../store/project/project.selectors";
import { selectIsConnect } from "../../../store/server-connect/server-connect.selectors";

@Component({
  selector: 'app-tool-panel-remote',
  templateUrl: './tool-panel-remote.component.html',
  styleUrls: ['./tool-panel-remote.component.scss']
})
export class ToolPanelRemoteComponent implements OnInit, OnDestroy {

  @Input() cy: any;
  vmStatusChecked = false;
  selectVMStatus$ = new Subscription();
  selectIsConnect$ = new Subscription();
  collectionId!: any;
  isConnect = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  connection = {
    name: '',
    id: 0
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private mapService: MapService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.selectIsConnect$ = this.store.select(selectIsConnect).subscribe(isConnect => {
      if (isConnect !== undefined) {
        this.isConnect = isConnect;
        const connection = this.serverConnectionService.getConnection();
        this.connection = connection ? connection : this.connection;
      }
    })
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatusChecked => {
      if (this.isConnect && vmStatusChecked !== undefined) {
        this.vmStatusChecked = vmStatusChecked;
      }
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    const connection = this.serverConnectionService.getConnection();
    if (connection) {
      this.connection = connection;
      if (this.connection && this.connection.id !== 0 && this.vmStatusChecked) {
        this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
        this.store.dispatch(retrievedIsConnect({ data: true }));
      }
    }
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.connection && this.connection.id !== 0 && this.vmStatusChecked) {
        this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  toggleVMStatus($event: any) {
    this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    const jsonData = {
      project_id: this.collectionId,
      connection_id: this.connection.id,
    }
    if ($event.checked) {
      this.mapService.saveVMStatus(jsonData, 'on').subscribe({
        next: response => {
          this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
        },
        error: err => {
          this.toastr.error('Save VM status failed', 'Failed');
          this.vmStatusChecked = !$event.checked;
        }
      })
    } else {
      this.mapService.saveVMStatus(jsonData, 'off').subscribe({
        next: response => {
          this.infoPanelService.removeVMStatusOnMap();
        },
        error: err => {
          this.toastr.error('Save VM status failed', 'Failed');
          this.vmStatusChecked = !$event.checked;
        }
      })
    }
  }

  openConnectServerForm() {
    const dialogData = {
      genData: this.connection
    }
    this.dialog.open(ServerConnectDialogComponent, { width: '600px', data: dialogData });
  }

  disconnectServer() {
    const jsonData = {
      pk: this.connection.id,
      project_id: this.collectionId
    }
    this.serverConnectionService.disconnect(jsonData)
      .subscribe({
        next: response => {
          
          this.connection = {
            name: 'Test Connection',
            id: 0
          }
          this.vmStatusChecked = false;
          this.infoPanelService.removeVMStatusOnMap();
          this.store.dispatch(retrievedIsConnect({ data: false }));
          this.store.dispatch(retrievedVMStatus({ vmStatus: undefined }));
          this.toastr.info(`Disconnected from ${this.connection.name} server!`);
        },
        error: err => {
          this.toastr.error('Could not to disconnect from Server', 'Error');
          return throwError(err.error.message);
        }
      })
   
  }

}
