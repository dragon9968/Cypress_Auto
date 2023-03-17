import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription, throwError } from "rxjs";
import { Component, Input, OnDestroy } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { InfoPanelShowValidationResultsComponent } from "../../../shared/components/info-panel-show-validation-results/info-panel-show-validation-results.component";

@Component({
  selector: 'app-info-panel-interface',
  templateUrl: './info-panel-interface.component.html',
  styleUrls: ['./info-panel-interface.component.scss']
})
export class InfoPanelInterfaceComponent implements OnDestroy {

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
  isClickAction = false;
  tabName = 'edge';
  selectMapSelection$ = new Subscription();

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
        field: 'order',
        minWidth: 80,
        flex: 1,
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'description',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'status',
        minWidth: 130,
        flex: 1,
      },
      {
        field: 'category',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'node',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'mac_address',
        headerName: 'Mac Address',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'port_group',
        headerName: 'Port Group',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'ip_allocation',
        headerName: 'IP Allocation',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'ip',
        headerName: 'IP',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'netmask',
        minWidth: 100,
        flex: 1,
      }
    ]
  };

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private interfaceService: InterfaceService,
    private infoPanelService: InfoPanelService
  ) {
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setEdgeInfoPanel(this.activeEdges);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy
    };
    this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  private _setRowActive() {
    this.gridApi.forEachNode(rowNode => {
      const activeEdgeIds = this.activeEdges.map(ele => ele.data('id'));
      if (activeEdgeIds.includes(rowNode.data.id)) {
        rowNode.setSelected(true);
      }
    });
  }

  private _setEdgeInfoPanel(activeEdges: any[]) {
    if (this.activeEdges.length === 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      if (this.gridApi != null) {
        const rowData = activeEdges.map(ele => ele.data())
        this.gridApi.setRowData(rowData);
        this._setRowActive();
      }
    }
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.interface_id);
  }

  deleteInterfaces() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Delete edge(s) from this project?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.rowsSelectedId.map(edgeId => {
            this.infoPanelService.deleteInfoPanelAssociateMap(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
              this.deletedNodes, this.deletedInterfaces, this.tabName, edgeId);
          })
          this.clearTable();
          this.store.dispatch(retrievedMapSelection({ data: true }));
        }
      })
    }
  }

  editInterfaces() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelectedId.length == 1) {
        const dialogData = {
          mode: 'update',
          genData: this.rowsSelected[0],
          cy: this.cy
        }
        this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      } else {
        const dialogData = {
          genData: {
            ids: this.rowsSelectedId,
            activeEdges: this.rowsSelected
          },
          cy: this.cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      }
    }
  }

  randomizeIp() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.rowsSelectedId.length == 1 ? 'Generate a new randomized IP for this interface?' : 'Generate a new randomized IP for these interfaces?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.randomizeIpInterfaces(this.rowsSelectedId);
        }
      });
    }
  }

  validateNode() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.interfaceService.validate({ pks: this.rowsSelectedId }).pipe(
        catchError((error: any) => {
          this.toastr.error(error.error.message);
          this.dialog.open(InfoPanelShowValidationResultsComponent, {
            autoFocus: false,
            width: 'auto',
            data: error.error.result
          });
          return throwError(() => error.error.message);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }

  clearTable() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.setRowData([]);
  }
}
