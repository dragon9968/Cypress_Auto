import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { forkJoin, map, Subscription, throwError } from "rxjs";
import { Component, DoCheck, Input } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/helpers/info-panel.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Store } from "@ngrx/store";
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";

@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent implements DoCheck {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  private gridApi!: GridApi;
  private activeNodeOld?: string;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  isClickAction: boolean = true;
  tabName = 'node';
  nodes: any[] = [];
  selectedNodes$ = new Subscription();

  private _setNodeInfoPanel(activeNodes: any[]) {
    if (activeNodes.length === 0) {
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
      })
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
    private domSanitizer: DomSanitizer,
    private nodeService: NodeService,
    private infoPanelService: InfoPanelService,
    private helpers: HelpersService,
    iconRegistry: MatIconRegistry
  ) {
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
    this.selectedNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodes => {
      if (nodes) {
        this.nodes = nodes;
      }
    });
  }

  ngDoCheck(): void {
    if (this.activeNodes.length == 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
    }
    const activeNodeIds = this.activeNodes.map(ele => ele.data('node_id'));
    const data = this.nodes.filter(ele => activeNodeIds.includes(ele.id));
    const stringNodeData = JSON.stringify(data);
    if (this.activeNodeOld !== stringNodeData) {
      this.activeNodeOld = stringNodeData;
      this._setNodeInfoPanel(this.activeNodes);
    }
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
            const newNodePosition = {x: cyData.logical_map_position.x, y: cyData.logical_map_position.y};
            const icon_src = '/static/img/uploads/' + cyData.icon.photo;
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
            cyData.id = 'node-' + cyData.id;
            cyData.node_id = cyData.id;
            cyData.domain = cyData.domain.name;
            cyData.height = cyData.logical_map_style.height;
            cyData.width = cyData.logical_map_style.width;
            cyData.text_color = cyData.logical_map_style.text_color;
            cyData.text_size = cyData.logical_map_style.text_size;
            cyData.groups = nodeData.result.groups;
            this.helpers.addCYNode(this.cy, {
              newNodeData: {...newNodeData, ...cyData},
              newNodePosition: newNodePosition
            });
            this.helpers.reloadGroupBoxes(this.cy);
          })
        })
        const nameNodeStr = response.result.map((ele: any) => ele.data.name).join(', ');
        this.toastr.success(`Cloned node ${nameNodeStr} successfully`);
      })
    }
  }

  deleteNodes() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'You sure you want to delete this item?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
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
          file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        } else if (format === 'csv') {
          file = new Blob([response], {type: 'text/csv;charset=utf-8;'});
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
      this.nodeService.validate({pks}).pipe(
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
