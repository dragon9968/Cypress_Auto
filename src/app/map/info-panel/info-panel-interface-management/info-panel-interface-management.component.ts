import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy } from '@angular/core';
import { Observable, of, Subscription, throwError } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { retrievedInterfacesManagement } from "../../../store/interface/interface.actions";
import { selectInterfacesManagement } from "../../../store/interface/interface.selectors";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";

@Component({
  selector: 'app-info-panel-interface-management',
  templateUrl: './info-panel-interface-management.component.html',
  styleUrls: ['./info-panel-interface-management.component.scss']
})
export class InfoPanelInterfaceManagementComponent implements OnDestroy {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  rowData$!: Observable<any[]>;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  isClickAction = false;
  tabName = 'edgeManagement';
  selectInterfacesManagement$ = new Subscription();
  interfacesManagement: any[] = [];

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
    this.selectInterfacesManagement$ = this.store.select(selectInterfacesManagement).subscribe(interfacesManagement => {
      if (interfacesManagement) {
        this.interfacesManagement = interfacesManagement;
        if (this.gridApi) {
          this.gridApi.setRowData(interfacesManagement);
        } else {
          this.rowData$ = of(interfacesManagement);
        }
        this._setRowActive();
      }
    })
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnDestroy(): void {
    this.selectInterfacesManagement$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
    };
    this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  private _setRowActive() {
    if (this.rowsSelected.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.interface_id)) {
          rowNode.setSelected(true);
        }
      });
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
          const newInterfacesManagement = [...this.interfacesManagement];
          this.interfacesManagement.map(edge => {
            if (this.rowsSelectedId.includes(edge.interface_id)) {
              this.deletedInterfaces.push({
                'name': edge.id,
                'interface_id': edge.interface_id
              });
              const index = newInterfacesManagement.findIndex(ele => ele.interface_id === edge.interface_id);
              newInterfacesManagement.splice(index, 1);
          }})
          this.clearRow();
          this.store.dispatch(retrievedInterfacesManagement({ data: newInterfacesManagement }));
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
          cy: this.cy,
          tabName: this.tabName
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
          this.interfaceService.randomizeIpBulk({ pks: this.rowsSelectedId }).pipe(
            catchError((error: any) => {
              this.toastr.error(error.error.message);
              return throwError(() => error.error.message);
            })
          ).subscribe(response => {
            const data = response.result;
            const newInterfacesManagement = this.infoPanelService.getNewInterfacesManagement(data);
            this.store.dispatch(retrievedInterfacesManagement({ data: newInterfacesManagement }))
            response.message.map((message: string) => {
              this.toastr.success(message);
            });
          });
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
          return throwError(() => error.error.message);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }

  clearRow() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.deselectAll();
  }
}
