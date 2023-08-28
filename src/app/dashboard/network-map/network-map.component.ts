import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import * as cytoscape from 'cytoscape';
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription, throwError } from "rxjs";
import { Component, OnDestroy, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from "../../../environments/environment";
import { RouteSegments } from "../../core/enums/route-segments.enum";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ProjectService } from "../../project/services/project.service";
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../core/services/server-connect/server-connect.service";
import { loadMap } from "../../store/map/map.actions";
import { selectIsHypervisorConnect } from "../../store/server-connect/server-connect.selectors";
import { retrievedIsHypervisorConnect } from "../../store/server-connect/server-connect.actions";
import { selectDashboard, selectDefaultPreferences, selectVMStatus } from "../../store/project/project.selectors";
import { retrievedDashboard, retrievedVMStatus } from "../../store/project/project.actions";
import { RemoteCategories } from "../../core/enums/remote-categories.enum";
import { selectLogicalNodes, selectPhysicalNodes } from "src/app/store/node/node.selectors";
import { selectLogicalMapInterfaces, selectPhysicalInterfaces } from "src/app/store/interface/interface.selectors";
import { selectMapPortGroups } from "src/app/store/portgroup/portgroup.selectors";

const expandCollapse = require('cytoscape-expand-collapse');
const nodeEditing = require('cytoscape-node-editing');
const konva = require('konva');
const jquery = require('jquery');

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
  projectId = 0;
  category = 'logical';
  vmStatusChecked: any;
  selectDefaultPreferences$ = new Subscription();
  selectVMStatus$ = new Subscription();
  selectIsHypervisorConnect$ = new Subscription();
  selectLogicalNodes$ = new Subscription();
  selectPhysicalNodes$ = new Subscription();
  selectDashboard$ = new Subscription();
  selectLogicalMapInterfaces$ = new Subscription();
  selectPhysicalInterfaces$ = new Subscription();
  selectMapPortGroups$ = new Subscription();
  isEdgeDirectionChecked = false;
  styleExists: any;
  cleared: any;
  nodes: any[] = [];
  logicalNodes: any[] = [];
  physicalNodes: any[] = [];
  logicalMapInterfaces: any[] = [];
  physicalInterfaces: any[] = [];
  portGroups: any[] = [];
  interfaces: any[] = [];
  defaultPreferences: any;
  dashboard: any;
  isMaximize = true;
  isHypervisorConnect = false;
  connection = {
    name: 'Test Connection',
    id: 0
  }

  constructor(
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private iconRegistry: MatIconRegistry,
    private helpersService: HelpersService,
    private projectService: ProjectService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    expandCollapse(cytoscape);
    nodeEditing(cytoscape, jquery, konva);
    this.iconRegistry.addSvgIcon('minus', this.helpersService.setIconPath('/assets/icons/dashboard/minus.svg'));
    this.iconRegistry.addSvgIcon('plus', this.helpersService.setIconPath('/assets/icons/dashboard/plus.svg'));
    this.projectId = this.projectService.getProjectId();
    this.store.dispatch(loadMap({ projectId: this.projectId, mapCategory: this.category }));
    const connection = this.serverConnectionService.getConnection(RemoteCategories.HYPERVISOR);
    this.connection = connection ? connection : this.connection;
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      if (isHypervisorConnect !== undefined) {
        this.isHypervisorConnect = isHypervisorConnect;
      }
    })
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatusChecked => {
      if (this.isHypervisorConnect && vmStatusChecked !== undefined) {
        this.vmStatusChecked = vmStatusChecked;
        if (this.vmStatusChecked) {
          this.infoPanelService.changeVMStatusOnMap(+this.projectId, this.connection.id);
        } else {
          this.infoPanelService.removeMapStatusOnMap();
        }
      }
    })
    this.selectDashboard$ = this.store.select(selectDashboard).subscribe(dashboard => {
      if (dashboard) {
        this.dashboard = dashboard;
      }
    })
    this.selectLogicalNodes$ = this.store.select(selectLogicalNodes).subscribe((logicalNodes: any) => {
      if (logicalNodes) {
        this.logicalNodes = logicalNodes;
      }
    });
    this.selectPhysicalNodes$ = this.store.select(selectPhysicalNodes).subscribe((physicalNodes: any) => {
      if (physicalNodes) {
        this.physicalNodes = physicalNodes;
      }
    });
    this.selectLogicalMapInterfaces$ = this.store.select(selectLogicalMapInterfaces).subscribe(logicalMapInterfaces => {
      if (logicalMapInterfaces) {
        this.logicalMapInterfaces = logicalMapInterfaces;
      }
    });
    this.selectPhysicalInterfaces$ = this.store.select(selectPhysicalInterfaces).subscribe(physicalWiredInterfaces => {
      if (physicalWiredInterfaces) {
        this.physicalInterfaces = physicalWiredInterfaces;
      }
    });
    this.selectMapPortGroups$ = this.store.select(selectMapPortGroups).subscribe((portGroups: any) => {
      if (portGroups) {
        this.portGroups = portGroups;
      }
    });
  }

  ngOnInit(): void {
    this.projectService.get(+this.projectId).subscribe((data: any) => {
      if (this.connection.id !== 0) {
        this.store.dispatch(retrievedVMStatus({ vmStatus: data.result.configuration.vm_status }));
      }
    })
    if (this.connection && this.connection.id !== 0) {
      this.store.dispatch(retrievedIsHypervisorConnect({ data: true }));
    }
    if (this.dashboard?.map) {
      this.selectDefaultPreferences$ = this.store.select(selectDefaultPreferences).subscribe(defaultPreferences => {
        if (defaultPreferences) {
          this.defaultPreferences = defaultPreferences;
          this.isEdgeDirectionChecked = defaultPreferences.edge_direction_checkbox != undefined
            ? defaultPreferences.edge_direction_checkbox : this.isEdgeDirectionChecked;
          this._initCytoscapeNetworkMap();
          if (this.connection && this.connection.id !== 0 && this.vmStatusChecked) {
            this.infoPanelService.changeVMStatusOnMap(+this.projectId, this.connection.id);
          }
          this.helpersService.initCollapseExpandMapLink()
          this.helpersService.changeEdgeDirectionOnMap(this.cy, this.isEdgeDirectionChecked)
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.selectDefaultPreferences$.unsubscribe();
    this.selectVMStatus$.unsubscribe();
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectDashboard$.unsubscribe();
    this.selectLogicalNodes$.unsubscribe();
    this.selectPhysicalNodes$.unsubscribe();
    this.selectMapPortGroups$.unsubscribe();
    this.selectPhysicalInterfaces$.unsubscribe();
    this.selectLogicalMapInterfaces$.unsubscribe();
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
    const nodeData = this.category === 'logical' ? this.logicalNodes : this.physicalNodes; 
    const interfacesData = this.category === 'logical' ? this.logicalMapInterfaces : this.physicalInterfaces
    const interfacesValid = this.category == 'logical' ? interfacesData.filter(i => i.port_group_id) : interfacesData.filter(i => i.data.target)
    const portGroupsData = this.category === 'logical' ? this.portGroups : []
    this.eles = JSON.parse(JSON.stringify(nodeData.concat(interfacesValid).concat(portGroupsData)));
    this.eles.forEach((ele: any) => {
      ele.locked = ele.data.locked
      if (ele.data.elem_category == 'node' || ele.data.elem_category == 'map_link') {
        ele.data.icon = ele.data.icon;
      } else if (ele.data.elem_category == 'bg_image') {
        ele.data.src = environment.apiBaseUrl + ele.data.image;
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
    this.helpersService.cy = this.cy;
    this.helpersService.randomPositionForElementsNoPosition(this.cy)
    this.cy.expandCollapse({
      layoutBy: null,
      fisheye: false,
      undoable: false,
      animate: false
    });
    this.cy.nodes().on('expandcollapse.beforecollapse', ($event: any) => {
      let a = this.cy.nodeEditing('get');
      if (a) {
        a.removeGrapples()
      }
      a = null;
    });
  }

  toggleVMStatus($event: any) {
    const jsonData = {
      project_id: this.projectId,
      connection_id: this.connection.id,
    }
    if ($event.checked) {
      this.store.dispatch(retrievedVMStatus({ vmStatus: $event.checked }));
    } else {
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
    this.router.navigate([RouteSegments.MAP]);
  }

  removeDashboard() {
    const mode = 'remove';
    const card = 'map';
    this.projectService.putProjectDashboard(+this.projectId, mode, card).pipe(
      catchError(err => {
        this.toastr.error(`Update dashboard (${mode}-${card}) failed`, 'Error');
        return throwError(() => err);
      })
    ).subscribe(response => {
      this.projectService.get(+this.projectId).subscribe(projectData => {
        this.store.dispatch(retrievedDashboard({dashboard: projectData.result.dashboard}));
      });
      this.toastr.success(response.message, 'Success');
    })
  }

}
