import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { forkJoin, map, Subscription, throwError } from "rxjs";
import { Component, Input } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Store } from "@ngrx/store";
import { ICON_PATH } from "../../../shared/contants/icon-path.constant";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";

@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  isClickAction: boolean = true;
  tabName = 'node';
  selectIsSelectedNodes$ = new Subscription();

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber-100) + 'px' : '200px';
  }

  private _setNodeInfoPanel(activeNodes: any[]) {
    if (activeNodes.length === 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activeNodes.map((ele: any) => {
          return this.nodeService.get(ele.data('node_id')).pipe(
            map(nodeData => {
              const result = nodeData.result;
              return {
                id: result.id,
                name: result.name,
                category: result.category,
                role: result.role,
                device: result.device.name,
                template: result.template.display_name,
                hardware: result.hardware?.serial_number,
                folder: result.folder,
                domain: result.domain.name,
                interfaces: result.interfaces,
                configuration_show: result.configuration_show,
                login_profile_show: result.login_profile_show,
              };
            })
          )
        })
      ).subscribe(rowData => {
        if (this.gridApi != null) {
          this.gridApi.setRowData(rowData);
        }
        if (this.rowsSelectedId.length > 0 && this.gridApi) {
          this.gridApi.forEachNode(rowNode => {
            if (this.rowsSelectedId.includes(rowNode.data.id)) {
              rowNode.setSelected(true);
            }
          })
        }
      });
    }
  }

  public gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    rowSelection: 'multiple',
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressSizeToFit: true,
        width: 52,
      },
      {
        headerName: 'Actions',
        field: 'id',
        suppressSizeToFit: true,
        width: 160,
        cellRenderer: InfoPanelRenderComponent,
        cellClass: 'node-actions',
        cellRendererParams: {
          tabName: this.tabName,
          getExternalParams: () => this
        }
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'category',
        minWidth: 80,
        flex: 1,
        maxWidth: 120
      },
      {
        field: 'role',
        minWidth: 80,
        flex: 1,
        maxWidth: 120
      },
      {
        field: 'device',
        minWidth: 80,
        flex: 1,
        maxWidth: 120
      },
      {
        field: 'template',
        minWidth: 90,
        flex: 1,
        maxWidth: 120,
      },
      {
        field: 'hardware',
        minWidth: 90,
        flex: 1,
        maxWidth: 120,
      },
      {
        field: 'folder',
        minWidth: 60,
        flex: 1,
        maxWidth: 100,
      },
      {
        field: 'domain',
        minWidth: 80,
        flex: 1,
        maxWidth: 120,
      },
      {
        field: 'interfaces',
        minWidth: 160,
        flex: 1,
        cellRenderer: (param: any) => param.value,
        autoHeight: true
      },
      {
        field: 'login_profile_show',
        headerName: 'Login Profile',
        minWidth: 150,
        flex: 1,
        cellRenderer: (param: any) => param.value,
      },
      {
        field: 'configuration_show',
        headerName: 'Configuration',
        flex: 1,
        cellRenderer: (param: any) => param.value,
        autoHeight: true
      },
    ]
  };

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    private nodeService: NodeService,
    private helpers: HelpersService,
    private infoPanelService: InfoPanelService,
    private interfaceService: InterfaceService,
  ) {
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
    this.selectIsSelectedNodes$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setNodeInfoPanel(this.activeNodes);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  cloneNodes() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Clone this node?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const ids = this.rowsSelected.map(ele => ele.id);
          const jsonData = {
            ids: ids
          }
          this.nodeService.cloneBulk(jsonData).pipe(
            catchError((e: any) => {
              this.toastr.error(e.error.message);
              return throwError(() => e);
            })
          ).subscribe(response => {
            const newNodeIds = response.result.map((ele: any) => ele.data.id);
            newNodeIds.map((id: any) => {
              this.nodeService.get(id).subscribe(nodeData => {
                const cyData = nodeData.result;
                const newNodePosition = { x: cyData.logical_map_position.x, y: cyData.logical_map_position.y };
                const icon_src = ICON_PATH + cyData.icon.photo;
                const newNodeData = {
                  "elem_category": "node",
                  "icon": icon_src,
                  "type": cyData.role,
                  "zIndex": 999,
                  "background-image": icon_src,
                  "background-opacity": 0,
                  "shape": "roundrectangle",
                  "text-opacity": 1
                }
                cyData.id = 'node-' + nodeData.id;
                cyData.node_id = nodeData.id;
                cyData.domain = cyData.domain.name;
                cyData.height = cyData.logical_map_style.height;
                cyData.width = cyData.logical_map_style.width;
                cyData.text_color = cyData.logical_map_style.text_color;
                cyData.text_size = cyData.logical_map_style.text_size;
                cyData.groups = nodeData.result.groups;
                cyData.icon = icon_src;
                this.helpers.addCYNode(this.cy, {
                  newNodeData: { ...newNodeData, ...cyData },
                  newNodePosition: newNodePosition
                });
                this.helpers.reloadGroupBoxes(this.cy);

                // Draw interface related to Nodes
                this.interfaceService.getByNode(id).subscribe((respData: any) => {
                  respData.result.map((edgeData: any) => {
                    if (edgeData.category !== 'management') {
                      const id = edgeData.id;
                      const ip_str = edgeData.ip ? edgeData.ip : "";
                      const ip = ip_str.split(".");
                      const last_octet = ip.length == 4 ? "." + ip[3] : "";
                      const cyData = edgeData;
                      cyData.id = id;
                      cyData.interface_id = id;
                      cyData.ip_last_octet = last_octet;
                      const logicalMapStyle = cyData.logical_map_style;
                      cyData.width = logicalMapStyle.width;
                      cyData.text_color = logicalMapStyle.text_color;
                      cyData.text_size = logicalMapStyle.text_size;
                      cyData.color = logicalMapStyle.color;
                      const newEdgeData = {
                        source: 'node-' + edgeData.node_id,
                        target: 'pg-' + edgeData.port_group_id,
                        id: 'new_edge_' + this.helpers.createUUID(),
                        name: "",
                        category: cyData.category,
                        direction: cyData.direction,
                        curve_style: cyData.category == 'tunnel' ? 'bezier' : 'straight',
                        color: logicalMapStyle.color,
                        width: logicalMapStyle.width,
                      }
                      this.helpers.addCYEdge(this.cy, { ...newEdgeData, ...cyData });
                    }
                  })
                });
              })
            })
            response.result.map((ele: any) => {
              this.toastr.success(`Cloned node ${ele.data.name}`, 'Success');
            })
          })
        }
      })
    }
  }

  deleteNodes() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Delete node(s) from this project?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '450px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          if (this.rowsSelected.length === 0) {
            this.toastr.info('No row selected');
          } else {
            this.rowsSelectedId.map(id => {
              this.infoPanelService.delete(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
                this.deletedNodes, this.deletedInterfaces, this.tabName, id);
            })
          }
        }
      })
    }
  }

  editNodes() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelected.length == 1) {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, this.rowsSelectedId[0], [])
      } else {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, undefined, this.rowsSelectedId);
      }
    }
  }

  exportNodes(format: string) {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        pks: this.rowsSelectedId
      }
      const fileName = format === 'json' ? 'Node-Export.json' : 'node_export.csv';
      let file = new Blob();
      this.nodeService.export(format, jsonData).subscribe(response => {
        if (format === 'json') {
          file = new Blob([JSON.stringify(response, null, 4)], { type: 'application/json' });
        } else if (format === 'csv') {
          file = new Blob([response], { type: 'text/csv;charset=utf-8;' });
        }
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported node as ${format.toUpperCase()} file successfully`);
      })
    }
  }

  validateNode() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const pks = this.rowsSelectedId;
      this.nodeService.validate({ pks }).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      });
    }
  }
}
