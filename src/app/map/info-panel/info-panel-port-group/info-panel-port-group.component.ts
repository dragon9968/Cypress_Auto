import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { forkJoin, map, Subscription, throwError } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { Store } from "@ngrx/store";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";

@Component({
  selector: 'app-info-panel-port-group',
  templateUrl: './info-panel-port-group.component.html',
  styleUrls: ['./info-panel-port-group.component.scss']
})
export class InfoPanelPortGroupComponent implements OnInit {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  private gridApi!: GridApi;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  isClickAction = false;
  tabName = 'portGroup';
  collectionId = '0';
  selectIsSelectedNodes$ = new Subscription();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService
  ) {
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectIsSelectedNodes$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setPGInfoPanel(this.activePGs);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
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
        cellClass: 'pg-actions',
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
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'vlan',
        headerName: 'VLAN',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'subnet_allocation',
        headerName: 'Subnet Allocation',
        minWidth: 100,
        flex: 1,
        maxWidth: 250
      },
      {
        field: 'subnet',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'domain',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
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
    this.gridApi.sizeColumnsToFit();
  }

  private _setPGInfoPanel(activePGs: any[]) {
    if (activePGs.length === 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activePGs.map(ele => {
          return this.portGroupService.get(ele.data('pg_id')).pipe(
            map(pgData => {
                const result = pgData.result;
                return {
                  id: result.id,
                  name: result.name,
                  category: result.category,
                  vlan: result.vlan,
                  subnet_allocation: result.subnet_allocation,
                  subnet: result.subnet,
                  domain: result.domain.name,
                  interfaces: result.interfaces
                }
              }
            )
          )
        })
      ).subscribe(rowData => {
        if (this.gridApi != null) {
          this.gridApi.setRowData(rowData);
        }
      });
    }
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
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
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.rowsSelectedId.map(pgId => {
            this.infoPanelService.delete(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
              this.deletedNodes, this.deletedInterfaces, this.tabName, pgId);
          });
        }
      })
    }
  }

  editPortGroup() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelectedId.length === 1) {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, this.rowsSelectedId[0], [])
      } else {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, undefined, this.rowsSelectedId);
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
          file = new Blob([response.data], {type: 'application/json'});
        } else if (format == 'json') {
          file = new Blob([response.data], {type: 'text/csv;charset=utf-8;'})
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(response.message);
      })
    }
  }

  randomizeSubnet() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Generate a new randomize subnet for this port_group?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: dialogData});
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
            response.result.map((ele: any) => {
              const element = this.cy.getElementById('pg-' + ele.id);
              element.data('subnet', ele.subnet);
              element.data('name', ele.name);
            })
            this.toastr.success(response.message);
          })
        }
      })
    }
  }

  validatePortGroup() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.portGroupService.validate({pks: this.rowsSelectedId}).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }
}
