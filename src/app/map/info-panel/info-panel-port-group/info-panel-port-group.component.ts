import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription, throwError } from "rxjs";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { ExportType } from "../../../core/models/common.model";
import { PortGroupExportModel } from "../../../core/models/port-group.model";
import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { retrievedMapFilterOptionPG } from "src/app/store/map-filter-option/map-filter-option.actions";
import { selectManagementPGs, selectPortGroups } from "src/app/store/portgroup/portgroup.selectors";
import { selectMapFilterOptionPG } from "src/app/store/map-filter-option/map-filter-option.selectors";

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
  filterOptionForm!: FormGroup;
  portGroups: any[] = [];
  managementPGs: any[] = [];
  activeEleIds: any[] = [];
  rowDataPG: any[] = [];
  filterOption = 'all';
  tabName = 'portgroup';
  projectId = '0';
  selectMapSelection$ = new Subscription();
  selectPortGroups$ = new Subscription();
  selectManagementPGs$ = new Subscription();
  selectMapFilterOptionPG$ = new Subscription();
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
        field: 'domain.name',
        minWidth: 100,
        flex: 1,
      }
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy
    }
    this.dialog.open(AddUpdatePGDialogComponent, {
      disableClose: true,
      width: '800px',
      autoFocus: false,
      data: dialogData,
      panelClass: 'custom-node-form-modal'
    });
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
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe(portGroups => {
      if (portGroups) {
        this.portGroups = portGroups
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
    });
    this.selectManagementPGs$ = this.store.select(selectManagementPGs).subscribe(managementPGs => {
      if (managementPGs) {
        this.managementPGs = managementPGs;
      }
    });

    this.selectMapFilterOptionPG$ = this.store.select(selectMapFilterOptionPG).subscribe(mapFilterOption => {
      if (mapFilterOption) {
        this.filterOption = mapFilterOption;
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
    })

    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        const activeEleIds = this.activePGs.map(ele => ele.data('id'));
        if (this.filterOption == 'all') {
          this.infoPanelTableComponent?.setRowData(this.portGroups);
          this.infoPanelTableComponent?.deselectAll();
          this.infoPanelTableComponent?.setRowActive(activeEleIds);
        } else if (this.filterOption == 'selected') {
          this.rowDataPG = this.activePGs.map(ele => ele.data());
          this.infoPanelTableComponent?.setSelectedEles(activeEleIds, this.rowDataPG);
        } else if (this.filterOption === 'management') {
          this.infoPanelTableComponent?.setRowData(this.managementPGs);
        }
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('all')
    });
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
    this.selectMapFilterOptionPG$.unsubscribe();
    this.selectPortGroups$.unsubscribe();
    this.selectManagementPGs$.unsubscribe();
  }

  deletePortGroup() {
    this.infoPanelTableComponent?.delete(this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs);
  }

  editPortGroup() {
    this.infoPanelTableComponent?.edit();
  }

  exportPortGroup(format: ExportType) {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData: PortGroupExportModel = {
        pks: this.infoPanelTableComponent?.rowsSelectedId as number[],
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
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.randomizeSubnetPortGroups(this.infoPanelTableComponent?.rowsSelectedId as number[], Number(this.projectId));
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


  changeFilterOption(menuTrigger: MatMenuTrigger, $event: any) {
    menuTrigger.closeMenu();
    if ($event.value == 'all') {
      this.infoPanelTableComponent?.setRowData(this.portGroups);
    } else if ($event.value === 'management') {
      const portGroupsManagement = this.portGroups.filter(pg => pg.category === 'management')
      this.infoPanelTableComponent?.setRowData(portGroupsManagement);
    } else {
      this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowDataPG);
    }
    this.store.dispatch(retrievedMapFilterOptionPG({ data: $event.value }));
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
