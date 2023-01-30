import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription, throwError } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectPortGroupsManagement } from "../../../store/portgroup/portgroup.selectors";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { retrievedPortGroupsManagement } from "../../../store/portgroup/portgroup.actions";

@Component({
  selector: 'app-info-panel-port-group-management',
  templateUrl: './info-panel-port-group-management.component.html',
  styleUrls: ['./info-panel-port-group-management.component.scss']
})
export class InfoPanelPortGroupManagementComponent implements OnInit, OnDestroy {

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
  tabName = 'portGroupManagement';
  collectionId = '0';
  selectMapSelection$ = new Subscription();
  selectPortGroupsManagement = new Subscription();
  portGroupsManagement: any[] = [];

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private projectService: ProjectService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService
  ) {
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectPortGroupsManagement = this.store.select(selectPortGroupsManagement).subscribe(pgsManagement => {
      if (pgsManagement) {
        this.portGroupsManagement = pgsManagement;
        if (this.gridApi) {
          this.gridApi.setRowData(pgsManagement);
        } else {
          this.rowData$ = of(pgsManagement);
        }
      }
      this._setRowActive();
    })
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.collectionId = this.projectService.getCollectionId();
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
    this.selectPortGroupsManagement.unsubscribe();
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
        field: 'name',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'category',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'vlan',
        headerName: 'VLAN',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'subnet_allocation',
        headerName: 'Subnet Allocation',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'subnet',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'domain',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'interfaces',
        minWidth: 300,
        flex: 1,
        cellRenderer: (param: any) => param.value,
        cellClass: 'row-interface',
        autoHeight: true
      }
    ]
  };

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
    }
    this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  private _setRowActive() {
    if (this.rowsSelected.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if(this.rowsSelectedId.includes(rowNode.data.pg_id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.pg_id);
  }

  deletePortGroup() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Delete port_group(s) from this switch?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const newPGsManagement = [...this.portGroupsManagement];
          this.portGroupsManagement.map(portGroup => {
            if (this.rowsSelectedId.includes(portGroup.pg_id)) {
              this.deletedNodes.push({
                'elem_category': 'port_group',
                'label': portGroup.label,
                'id': portGroup.pg_id
              });
              const index = newPGsManagement.findIndex(ele => ele.pg_id === portGroup.pg_id);
              newPGsManagement.splice(index, 1);
            }
          })
          this.clearRow();
          this.store.dispatch(retrievedPortGroupsManagement({data: newPGsManagement}))
        }
      })
    }
  }

  editPortGroup() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelectedId.length === 1) {
        const dialogData = {
          mode: 'update',
          genData: this.rowsSelected[0],
          cy: this.cy,
          tabName: this.tabName
        }
        this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      } else {
        const dialogData = {
          genData: {
            ids: this.rowsSelectedId,
            activePGs: this.rowsSelected
          },
          cy: this.cy,
          tabName: this.tabName
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      }
    }
  }

  exportPortGroup(format: string) {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        pks: this.rowsSelectedId,
        format: format
      }
      let file = new Blob();
      this.portGroupService.export(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(response => {
        if (format == 'csv') {
          file = new Blob([response.data], { type: 'application/json' });
        } else if (format == 'json') {
          file = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Export port group as ${format.toUpperCase()} file successfully`);
      })
    }
  }

  randomizeSubnet() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedId.length === 1 ? 'this' : 'these';
      const sSuffix = this.rowsSelectedId.length === 1 ? '' : 's';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Generate a new randomize subnet for ${item} port_group${sSuffix}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const jsonData = {
            pks: this.rowsSelectedId,
            collection_id: this.collectionId
          }
          this.portGroupService.randomizeSubnetBulk(jsonData).pipe(
            catchError((e: any) => {
              this.toastr.error(e.error.message);
              return throwError(() => e);
            })
          ).subscribe(response => {
            this.toastr.success(response.message);
            const newPGsManagement = this.infoPanelService.getNewPortGroupsManagement(response.result);
            this.infoPanelService.updateInterfaceIPBasedOnPGId(this.rowsSelectedId);
            this.store.dispatch(retrievedPortGroupsManagement({ data: newPGsManagement }));
          })
        }
      })
    }
  }

  validatePortGroup() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.portGroupService.validate({ pks: this.rowsSelectedId }).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
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
