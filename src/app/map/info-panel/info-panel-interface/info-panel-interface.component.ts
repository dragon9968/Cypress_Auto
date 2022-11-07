import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { forkJoin, map, Subscription, throwError } from "rxjs";
import { Component, Input } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { selectInterfaces } from "../../../store/map/map.selectors";
import { retrievedInterfacesByIds } from "../../../store/interface/interface.actions";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";

@Component({
  selector: 'app-info-panel-interface',
  templateUrl: './info-panel-interface.component.html',
  styleUrls: ['./info-panel-interface.component.scss']
})
export class InfoPanelInterfaceComponent {

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
  tabName = 'edge';
  selectIsSelectedNodes$ = new Subscription();

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
        cellClass: 'interface-actions',
        cellRendererParams: {
          tabName: this.tabName,
          getExternalParams: () => this
        }
      },
      {
        field: 'order',
        minWidth: 80,
        flex: 1,
        maxWidth: 120
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'description',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'status',
        minWidth: 130,
        flex: 1,
        maxWidth: 170
      },
      {
        field: 'category',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'mac_address',
        headerName: 'Mac Address',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
      },
      {
        field: 'port_group',
        headerName: 'Port Group',
        minWidth: 100,
        flex: 1,
        maxWidth: 250
      },
      {
        field: 'ip_allocation',
        headerName: 'IP Allocation',
        minWidth: 200,
        flex: 1,
        maxWidth: 270
      },
      {
        field: 'ip',
        headerName: 'IP',
        minWidth: 200,
        flex: 1,
        maxWidth: 270
      },
      {
        field: 'netmark',
        minWidth: 100,
        flex: 1,
        maxWidth: 200
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
    this.selectIsSelectedNodes$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this._setEdgeInfoPanel(this.activeEdges);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  private _setEdgeInfoPanel(activeEdges: any[]) {
    if (this.activeEdges.length === 0) {
      this.rowsSelected = [];
      this.rowsSelectedId = [];
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activeEdges.map(ele => {
          return this.interfaceService.get(ele.data('id')).pipe(
            map(edgeData => {
              const result = edgeData.result;
              return {
                id: result.id,
                order: result.order,
                name: result.name,
                description: result.description,
                status: result.status,
                category: result.category,
                mac_address: result.mac_address,
                port_group: result.port_group.name,
                ip_allocation: result.ip_allocation,
                ip: result.ip,
                netmask: result.netmask.mask
              }
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

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
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
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.rowsSelectedId.map(edgeId => {
            this.infoPanelService.delete(this.cy, this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs,
              this.deletedNodes, this.deletedInterfaces, this.tabName, edgeId);
          })
          this.gridApi.deselectAll();
        }
      })
    }
  }

  editInterfaces() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      if (this.rowsSelectedId.length == 1) {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, this.rowsSelectedId[0], []);
      } else {
        this.infoPanelService.openEditInfoPanelForm(this.cy, this.tabName, undefined, this.rowsSelectedId);
      }
    }
  }

  randomizeIp() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.rowsSelectedId.length == 1 ? 'Generate a new randomized IP for this interface?' : 'Generate a new randomized IP for those interfaces?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '500px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.interfaceService.randomizeIpBulk({pks: this.rowsSelectedId}).pipe(
            catchError((error: any) => {
              this.toastr.error(error.error.message);
              return throwError(error.error.message);
            })
          ).subscribe(response => {
            const data = response.result;
            data.map((ele: any) => {
              const element = this.cy.getElementById(ele.id);
              const ip_str = ele.ip ? ele.ip : "";
              const ip = ip_str.split(".");
              const last_octet = ip.length == 4 ? "." + ip[3] : "";
              element.data('ip_last_octet', last_octet);
            })
            response.message.map((message: string) => {
              this.toastr.success(message);
            });
            this.store.select(selectInterfaces).subscribe(interfaces => {
              const interfaceIds = interfaces.map((ele: any) => ele.data.id);
              this.interfaceService.getDataByPks({pks: interfaceIds}).subscribe(response => {
                this.store.dispatch(retrievedInterfacesByIds({data: response.result}));
              })
            })
          });
        }
      });
    }
  }

  validateNode() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.interfaceService.validate({pks: this.rowsSelectedId}).pipe(
        catchError((error: any) => {
          this.toastr.error(error.error.message);
          return throwError(error.error.message);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }
}
