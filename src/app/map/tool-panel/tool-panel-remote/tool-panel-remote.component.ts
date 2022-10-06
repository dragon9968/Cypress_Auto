import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { selectVMStatus } from "../../../store/project/project.selectors";
import { retrievedVMStatus } from "../../../store/project/project.actions";
import { MapService } from "../../../core/services/map/map.service";
import { ServerConnectDialogComponent } from "./server-connect-dialog/server-connect-dialog.component";

@Component({
  selector: 'app-tool-panel-remote',
  templateUrl: './tool-panel-remote.component.html',
  styleUrls: ['./tool-panel-remote.component.scss']
})
export class ToolPanelRemoteComponent implements OnInit {

  @Input() cy: any;
  vmStatusChecked!: boolean;
  selectProject$ = new Subscription();
  collectionId!: number;
  vmStatus!: any;

  connection = {
    name: 'Test Connection',
    connection_id: 0
  }

  statusColorLookup = {
    off: '#FF0000', //red
    on: '#008000', // green
    unknown: '#FFFF00' // yellow
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private mapService: MapService
  ) {
    this.selectProject$ = this.store.select(selectVMStatus).subscribe(vmStatus => {
      this.vmStatusChecked = vmStatus;
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.mapService.getVMStatus(this.collectionId, this.connection.connection_id).subscribe(vmStatus => {
      this.vmStatus = vmStatus;
    })
  }

  toggleVMStatus($event: any) {
    this.store.dispatch(retrievedVMStatus({vmStatus: $event.checked}));
    const jsonData = {
      project_id: this.collectionId,
      connection_id: this.connection.connection_id,
    }
    if ($event.checked) {
      this.mapService.saveVMStatus(jsonData, 'on').subscribe(response => {
        for (const [key, value] of Object.entries(this.vmStatus)) {
          this.delayedAlert(key, value);
        }
      })
    } else {
      this.mapService.saveVMStatus(jsonData, 'off').subscribe(response => {
        const nodes = this.cy.nodes().filter('[icon]');
        nodes.style('border-opacity', 0);
        nodes.style('border-width', 0);
        nodes.style('background-opacity', 0);
      })
    }
  }

  delayedAlert(nodeName: string, nodeStatus: any) {
    const ele = this.cy.nodes().filter(`[name='${nodeName}']`)[0];
    if (!ele) {
      return;
    }

    // set the VM Power and Status value in the tooltip
    ele.style({'background-opacity': '1'});
    ele.style({'border-width': '10px'});
    ele.style({'border-opacity': '1'});
    const d = nodeStatus;
    if (d.state == "on" && d.status == "running") {
      ele.data('color', this.statusColorLookup.on);
      ele.style({'border-color': this.statusColorLookup.on});
    } else if (d.state == "on" && d.status == "notRunning") {
      ele.data("color", this.statusColorLookup.unknown);
      ele.style({'border-color': this.statusColorLookup.unknown});
    } else if (d.state == "off") {
      ele.data('color', this.statusColorLookup.off);
      ele.style({'border-color': this.statusColorLookup.off});
    } else if (!(d.state == false)) {
      ele.style({'background-opacity': '0'});
      ele.style({'border-opacity': '0'});
    } else {
      ele.style({'background-opacity': '0'});
      ele.style({'border-opacity': '0'});
    }
  }

  openConnectServerForm() {
    const dialogData = {
      genData: this.connection
    }
    this.dialog.open(ServerConnectDialogComponent, {width: '600px', data: dialogData});
  }
}
