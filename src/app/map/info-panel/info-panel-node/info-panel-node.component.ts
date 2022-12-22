import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { CMActionsService } from "../../context-menu/cm-actions/cm-actions.service";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { InfoPanelShowValidationNodesComponent } from "../info-panel-show-validation-nodes/info-panel-show-validation-nodes.component";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { NodeBulkEditDialogComponent } from "../../bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component";

@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent implements OnDestroy {
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
  selectMapSelection$ = new Subscription();

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  private _setRowActive() {
    this.gridApi.forEachNode(rowNode => {
      const activeNodeIds = this.activeNodes.map(ele => ele.data('id'));
      if (activeNodeIds.includes(rowNode.data.id)) {
        rowNode.setSelected(true);
      }
    });
  }

  private _setNodeInfoPanel(activeNodes: any[]) {
    if (activeNodes.length === 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      const rowData = activeNodes.map((ele: any) => {
        if (ele.data('device')?.name) {
          ele.data('device', ele.data('device')?.name)
        }
        if (ele.data('template')?.name) {
          ele.data('template', ele.data('template')?.name)
        }
        if (ele.data('domain')?.name) {
          ele.data('domain', ele.data('domain')?.name)
        }
        if (ele.data('hardware')?.serial_number) {
          ele.data('hardware', ele.data('hardware')?.serial_number)
        }
        return ele.data();
      })
      if (this.gridApi != null) {
        this.gridApi.setRowData(rowData);
        this._setRowActive();
      }
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
    onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 52,
      },
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'category',
        width: 100,
        flex: 1
      },
      {
        field: 'role',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'device',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'template',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'hardware',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'folder',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'domain',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'interfaces',
        cellRenderer: (param: any) => param.value,
        autoHeight: true,
        minWidth: 100,
        flex: 1
      },
      {
        field: 'login_profile_show',
        headerName: 'Login Profile',
        cellRenderer: (param: any) => param.value,
        minWidth: 100,
        flex: 1
      },
      {
        field: 'configuration_show',
        headerName: 'Configuration',
        cellRenderer: (param: any) => param.value,
        autoHeight: true,
        flex: 1
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
    private cmActionsService: CMActionsService,
  ) {
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv-info-panel.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setNodeInfoPanel(this.activeNodes);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.node_id);
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.infoPanelService.viewInfoPanel(this.tabName, row.data.node_id);
  }

  cloneNodes() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.rowsSelected.length === 1 ? 'Clone this node?' : 'Clone those nodes?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const ids = this.rowsSelectedId;
          this.cmActionsService.cloneNodes(this.cy, ids);
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
              this.infoPanelService.deleteInfoPanelAssociateMap(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
                this.deletedNodes, this.deletedInterfaces, this.tabName, id);
            })
            this.clearTable();
            this.store.dispatch(retrievedMapSelection({ data: true }));
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
        const dialogData = {
          mode: 'update',
          genData: this.rowsSelected[0],
          cy: this.cy
        }
        this.dialog.open(AddUpdateNodeDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      } else {
        const dialogData = {
          genData: {
            ids: this.rowsSelectedId,
            activeNodes: this.rowsSelected
          },
          cy: this.cy
        }
        this.dialog.open(NodeBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
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
          const dialogRef = this.dialog.open(InfoPanelShowValidationNodesComponent, {
            autoFocus: false,
            width: 'auto',
            data: e.error.result
          });
          return throwError(() => e);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      });
    }
  }

  clearTable() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.setRowData([]);
  }
}
