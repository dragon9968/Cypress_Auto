import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject, Subscription, takeUntil } from "rxjs";
import { MapService } from "../../../core/services/map/map.service";
import { ProjectService } from "src/app/project/services/project.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../core/services/server-connect/server-connect.service";
import { retrievedVMStatus } from "../../../store/project/project.actions";
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

  connection = { name: '', id: 0 }
  connectionName = '';
  connectionCategory = '';
  connectionServer = '';
  connectionDatacenter = '';
  connectionCluster = '';
  connectionSwitch = '';
  connectionSwitchType = '';
  userName = '';

  constructor(
    private store: Store,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private mapService: MapService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.collectionId = this.projectService.getCollectionId();
    this.selectIsConnect$ = this.store.select(selectIsConnect).subscribe(isConnect => {
      if (isConnect !== undefined) {
        this.isConnect = isConnect;
        const connection = this.serverConnectionService.getConnection();
        this.connection = connection ? connection : { name: '', id: 0 };
        this._updateConnectionInfo(this.connection);
      }
    })
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatusChecked => {
      this.vmStatusChecked = vmStatusChecked;
      if (this.isConnect && vmStatusChecked) {
        this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
      } else {
        this.infoPanelService.removeMapStatusOnMap();
      }
    })
  }

  ngOnInit(): void {
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.connection && this.connection.id !== 0 && this.vmStatusChecked) {
        this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
      }
    });
  }

  ngOnDestroy(): void {
    this.selectVMStatus$.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  toggleVMStatus($event: any) {
    const jsonData = {
      project_id: this.collectionId,
      connection_id: this.connection.id,
    }
    if ($event.checked) {
      this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    }
    else {
      this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    }
  }

  refreshVMStatus() {
    this.infoPanelService.changeVMStatusOnMap(this.collectionId, this.connection.id);
  }

  private _updateConnectionInfo(connection: any) {
    if (connection.category && connection.parameters) {
      this.connectionName = connection.name;
      this.connectionCategory = connection.category;
      this.connectionServer = connection.parameters?.server;
      this.connectionDatacenter = connection.parameters?.datacenter;
      this.connectionCluster = connection.parameters?.cluster;
      this.connectionSwitch = connection.parameters?.switch;
      this.connectionSwitchType = connection.parameters?.switch_type;
      this.userName = connection.parameters?.username;
    }
  }
}
