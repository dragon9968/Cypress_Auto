import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription, throwError } from "rxjs";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { InfoPanelShowValidationResultsComponent } from "../../../shared/components/info-panel-show-validation-results/info-panel-show-validation-results.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";

@Component({
  selector: 'app-info-panel-port-group',
  templateUrl: './info-panel-port-group.component.html',
  styleUrls: ['./info-panel-port-group.component.scss']
})
export class InfoPanelPortGroupComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  tabName = 'portgroup';
  collectionId = '0';
  selectMapSelection$ = new Subscription();
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

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy
    }
    this.dialog.open(AddUpdatePGDialogComponent, { hasBackdrop: false, width: '600px', autoFocus: false, data: dialogData });
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private projectService: ProjectService,
    private portGroupService: PortGroupService,
    private infoPanelService: InfoPanelService
  ) {
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        const rowData = this.activePGs.map(ele => {
          if (ele.data('domain')?.name) {
            ele.data('domain', ele.data('domain').name);
          }
          return ele.data();
        });
        const activeEleIds = this.activePGs.map(ele => ele.data('id'));
        this.infoPanelTableComponent?.setSelectedEles(activeEleIds, rowData);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
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
  }

  deletePortGroup() {
    this.infoPanelTableComponent?.delete(this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs);
  }

  editPortGroup() {
    this.infoPanelTableComponent?.edit();
  }

  exportPortGroup(format: string) {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        pks: this.infoPanelTableComponent?.rowsSelectedId,
        format: format
      }
      let file = new Blob();
      this.portGroupService.export(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(response => {
        if (format == 'json') {
          file = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Export port group as ${format.toUpperCase()} file successfully`);
      })
    }
  }

  randomizeSubnet() {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.infoPanelTableComponent?.rowsSelectedId.length === 1 ? 'this' : 'these';
      const sSuffix = this.infoPanelTableComponent?.rowsSelectedId.length === 1 ? '' : 's';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Generate a new randomize subnet for ${item} port_group${sSuffix}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { hasBackdrop: false, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.randomizeSubnetPortGroups(this.infoPanelTableComponent?.rowsSelectedId, this.collectionId);
        }
      })
    }
  }

  validatePortGroup() {
    this.infoPanelTableComponent?.validate();
  }

  clearTable() {
    this.infoPanelTableComponent?.clearTable();
  }
}
