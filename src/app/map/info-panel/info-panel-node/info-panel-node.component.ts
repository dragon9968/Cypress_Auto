import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { forkJoin, map, Subscription, throwError } from "rxjs";
import { Component, Input, OnDestroy } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Store } from "@ngrx/store";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { CMActionsService } from "../../context-menu/cm-actions/cm-actions.service";
import { selectMapEdit } from "src/app/store/map-edit/map-edit.selectors";

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
  selectMapEdit$ = new Subscription();

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
                device: result.device?.name,
                template: result.template?.display_name,
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
        this.setRowActive();
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
        headerName: 'Actions',
        field: 'id',
        suppressSizeToFit: true,
        width: 160,
        cellRenderer: InfoPanelRenderComponent,
        cellClass: 'node-actions',
        cellRendererParams: {
          tabName: this.tabName,
          getExternalParams: () => this
        },
        sortable: false
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'category',
        minWidth: 80,
        flex: 1,
      },
      {
        field: 'role',
        minWidth: 80,
        flex: 1,
      },
      {
        field: 'device',
        minWidth: 80,
        flex: 1,
      },
      {
        field: 'template',
        minWidth: 90,
        flex: 1,
      },
      {
        field: 'hardware',
        minWidth: 90,
        flex: 1,
      },
      {
        field: 'folder',
        minWidth: 60,
        flex: 1,
      },
      {
        field: 'domain',
        minWidth: 80,
        flex: 1,
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
    private cmActionsService: CMActionsService,
  ) {
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setNodeInfoPanel(this.activeNodes);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
    this.selectMapEdit$ = this.store.select(selectMapEdit).subscribe(mapEdit => {
      if (mapEdit?.nodeEditedData?.length > 0) {
        this.gridApi.setRowData(mapEdit.nodeEditedData);
      }
    });
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
    this.selectMapEdit$.unsubscribe();
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
      const message = this.rowsSelected.length === 1 ? 'Clone this node?' : 'Clone those nodes?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const ids = this.rowsSelected.map(ele => ele.id);
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
              this.infoPanelService.delete(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
                this.deletedNodes, this.deletedInterfaces, this.tabName, id);
            })
            this.gridApi.deselectAll();
            this.store.dispatch(retrievedMapSelection({data: true}));
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

  clearTable() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.setRowData([]);
  }

  setRowActive() {
    if (this.activeNodes.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        const activeNodeIds = this.activeNodes.map(ele => ele.data('node_id'));
        if (activeNodeIds.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }
}
