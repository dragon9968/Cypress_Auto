import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { retrievedInterfacesManagement } from "../../../store/interface/interface.actions";
import { selectInterfacesManagement } from "../../../store/interface/interface.selectors";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";

@Component({
  selector: 'app-info-panel-interface-management',
  templateUrl: './info-panel-interface-management.component.html',
  styleUrls: ['./info-panel-interface-management.component.scss']
})
export class InfoPanelInterfaceManagementComponent implements OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  tabName = 'edgeManagement';
  selectInterfacesManagement$ = new Subscription();
  interfacesManagement: any[] = [];
  gridOptions: GridOptions = {
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

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy,
      tabName: this.tabName
    };
    this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

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
        this.infoPanelTableComponent?.setRowData(interfacesManagement);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedId);
      }
    })
  }

  ngOnDestroy(): void {
    this.selectInterfacesManagement$.unsubscribe();
  }

  deleteInterfaces() {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Delete edge(s) from this project?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const newInterfacesManagement = [...this.interfacesManagement];
          this.interfacesManagement.map(edge => {
            if (this.infoPanelTableComponent?.rowsSelectedId.includes(edge.interface_pk)) {
              this.deletedInterfaces.push({
                'name': edge.id,
                'interface_pk': edge.interface_pk
              });
              const index = newInterfacesManagement.findIndex(ele => ele.interface_pk === edge.interface_pk);
              newInterfacesManagement.splice(index, 1);
            }
          })
          this.clearRow();
          this.store.dispatch(retrievedInterfacesManagement({ data: newInterfacesManagement }));
        }
      })
    }
  }

  editInterfaces() {
    this.infoPanelTableComponent?.edit();
  }

  randomizeIp() {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.infoPanelTableComponent?.rowsSelectedId.length == 1 ? 'Generate a new randomized IP for this interface?' : 'Generate a new randomized IP for these interfaces?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.interfaceService.randomizeIpBulk({ pks: this.infoPanelTableComponent?.rowsSelectedId }).pipe(
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
    this.infoPanelTableComponent?.validate();
  }

  clearRow() {
    this.infoPanelTableComponent?.deselectAll();
  }
}
