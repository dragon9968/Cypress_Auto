import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import * as cytoscape from 'cytoscape';
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription, throwError } from "rxjs";
import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MapState } from "../../store/map/map.state";
import { environment } from "../../../environments/environment";
import { RouteSegments } from "../../core/enums/route-segments.enum";
import { MapService } from "../../core/services/map/map.service";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ProjectService } from "../../project/services/project.service";
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../core/services/server-connect/server-connect.service";
import { retrievedMap } from "../../store/map/map.actions";
import { selectIsConnect } from "../../store/server-connect/server-connect.selectors";
import { selectMapFeature } from "../../store/map/map.selectors";
import { retrievedIsConnect } from "../../store/server-connect/server-connect.actions";
import { selectDashboard, selectVMStatus } from "../../store/project/project.selectors";
import { retrievedDashboard, retrievedIsOpen, retrievedVMStatus } from "../../store/project/project.actions";

@Component({
  selector: 'app-network-map',
  templateUrl: './network-map.component.html',
  styleUrls: ['./network-map.component.scss']
})
export class NetworkMapComponent implements OnInit, OnDestroy {
  @Output() disableCard = new EventEmitter<any>();
  @Input() isLock!: boolean;
  cy: any;
  eles: any;
  config: any;
  collectionId = '0';
  category = 'logical';
  vmStatusChecked: any;
  selectMap$ = new Subscription();
  selectVMStatus$ = new Subscription();
  selectIsConnect$ = new Subscription();
  selectDashboard$ = new Subscription();
  styleExists: any;
  cleared: any;
  nodes: any[] = [];
  interfaces: any[] = [];
  mapBackgrounds: any[] = [];
  defaultPreferences: any;
  dashboard: any;
  isMaximize = true;
  isConnect = false;
  connection = {
    name: 'Test Connection',
    id: 0
  }

  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private mapService: MapService,
    private iconRegistry: MatIconRegistry,
    private helpersService: HelpersService,
    private projectService: ProjectService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.iconRegistry.addSvgIcon('minus', this.helpersService.setIconPath('/assets/icons/dashboard/minus.svg'));
    this.iconRegistry.addSvgIcon('plus', this.helpersService.setIconPath('/assets/icons/dashboard/plus.svg'));
    this.collectionId = this.projectService.getCollectionId();
    this.mapService.getMapData(this.category, this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedMap({ data }))
    );
    const connection = this.serverConnectionService.getConnection();
    this.connection = connection ? connection : this.connection;
    this.selectIsConnect$ = this.store.select(selectIsConnect).subscribe(isConnect => {
      if (isConnect !== undefined) {
        this.isConnect = isConnect;
      }
    })
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatusChecked => {
      if (this.isConnect && vmStatusChecked !== undefined) {
        this.vmStatusChecked = vmStatusChecked;
        if (this.vmStatusChecked) {
          this.infoPanelService.changeVMStatusOnMap(+this.collectionId, this.connection.id);
        }
      }
    })
    this.selectDashboard$ = this.store.select(selectDashboard).subscribe(dashboard => {
      if (dashboard) {
        this.dashboard = dashboard;
      }
    })
  }

  ngOnInit(): void {
    this.projectService.get(+this.collectionId).subscribe((data: any) => {
      if (this.connection.id !== 0) {
        this.store.dispatch(retrievedVMStatus({ vmStatus: data.result.configuration.vm_status }));
      }
    })
    if (this.connection && this.connection.id !== 0) {
      this.store.dispatch(retrievedIsConnect({ data: true }));
    }
    if (this.dashboard?.map) {
      this.selectMap$ = this.store.select(selectMapFeature).subscribe((map: MapState) => {
        if (map.defaultPreferences) {
          this.nodes = map.nodes;
          this.interfaces = map.interfaces;
          this.mapBackgrounds = map.mapBackgrounds;
          this.defaultPreferences = map.defaultPreferences;
          this._initCytoscapeNetworkMap();
          if (this.connection && this.connection.id !== 0 && this.vmStatusChecked) {
            this.infoPanelService.changeVMStatusOnMap(+this.collectionId, this.connection.id);
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.selectMap$.unsubscribe();
    this.selectVMStatus$.unsubscribe();
    this.selectIsConnect$.unsubscribe();
    this.selectDashboard$.unsubscribe();
  }

  private _initCytoscapeNetworkMap() {
    this.config = {
      styleExists: this.defaultPreferences?.accessed,
      cleared: this.defaultPreferences?.cleared,
      nodes_size_max: 200,
      text_size_max: 200,
      edge_size_max: 50,
      port_group_max: 200,
      display_status: true,
      range_map_refresh_time: 30000,
      search_color: "rgb(255,255,50)",
      debug_output: false
    }
    this.styleExists = this.config.styleExists;
    this.cleared = this.config.cleared;
    this.eles = JSON.parse(JSON.stringify(this.nodes
      .concat(this.interfaces)
      .concat(this.mapBackgrounds)));
    this.eles.forEach((ele: any) => {
      ele.locked = ele.data.locked
      if (ele.data.elem_category == 'node') {
        ele.data.icon = environment.apiBaseUrl + ele.data.icon;
      }
    });
    const style = this.helpersService.generateCyStyle(this.defaultPreferences);
    style.map(ele => {
      if (typeof ele.style['content'] === 'function' && ele.selector !== '[ip_last_octet]') {
        delete ele.style['content'];
      }
      return ele;
    })
    this.cy = cytoscape({
      container: document.getElementById("cy-network-map"),
      elements: this.eles,
      style: style,
      layout: (this.styleExists || this.cleared) ? { name: 'preset' } : {
        name: "cose",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 5,
        fit: true,
        animate: false,
      },
      wheelSensitivity: 0.2,
    });
    this.infoPanelService.cy = this.cy;
  }

  toggleVMStatus($event: any) {
    const jsonData = {
      project_id: this.collectionId,
      connection_id: this.connection.id,
    }
    if ($event.checked) {
      this.infoPanelService.changeVMStatusOnMap(+this.collectionId, +this.connection.id);
      this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    } else {
      this.infoPanelService.removeVMStatusOnMap();
      this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    }
  }


  toggleCardLock() {
    this.isLock = !this.isLock;
    this.disableCard.emit(this.isLock);
  }

  syncMap() {

  }

  openMap() {
    this.store.dispatch(retrievedIsOpen({data: true}));
    this.router.navigate(
      [RouteSegments.MAP],
      {
        queryParams: {
          category: 'logical',
          collection_id: this.collectionId
        }
      }
    );
  }

  removeDashboard() {
    const mode = 'remove';
    const card = 'map';
    this.projectService.putProjectDashboard(+this.collectionId, mode, card).pipe(
      catchError(err => {
        this.toastr.error(`Update dashboard (${mode}-${card}) failed`, 'Error');
        return throwError(() => err);
      })
    ).subscribe(response => {
      this.projectService.get(+this.collectionId).subscribe(projectData => {
        this.store.dispatch(retrievedDashboard({dashboard: projectData.result.dashboard}));
      });
      this.toastr.success(response.message, 'Success');
    })
  }

}
