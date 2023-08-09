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
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { ExportType } from "../../../core/models/common.model";
import { PortGroupExportModel } from "../../../core/models/port-group.model";
import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { selectIsSelectedFlag, selectManagementPGs, selectPortGroups, selectSelectedPortGroups } from "src/app/store/portgroup/portgroup.selectors";

@Component({
  selector: 'app-info-panel-port-group',
  templateUrl: './info-panel-port-group.component.html',
  styleUrls: ['./info-panel-port-group.component.scss']
})
export class InfoPanelPortGroupComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() infoPanelheight = '300px';
  filterOptionForm!: FormGroup;
  portGroups: any[] = [];
  managementPGs: any[] = [];
  selectedPGs: any[] = [];
  selectedIds: any[] = [];
  isSelectedFlag = false;
  rowDataPG: any[] = [];
  filterOption = 'all';
  tabName = 'portgroup';
  projectId = '0';
  selectPortGroups$ = new Subscription();
  selectManagementPGs$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectIsSelectedFlag$ = new Subscription();
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
    this.selectIsSelectedFlag$ = this.store.select(selectIsSelectedFlag).subscribe(isSelectedFlag => {
      this.isSelectedFlag = isSelectedFlag
    });
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe(portGroups => {
      if (portGroups && !this.isSelectedFlag) {
        this.portGroups = portGroups;
        this.loadPGsTable();
      }
    });
    this.selectManagementPGs$ = this.store.select(selectManagementPGs).subscribe(managementPGs => {
      if (managementPGs) {
        this.managementPGs = managementPGs;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGs = selectedPGs;
        this.selectedIds = selectedPGs.map(pg => pg.id);
        this.infoPanelTableComponent?.deselectAll();
        this.infoPanelTableComponent?.setRowActive(this.selectedIds);
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
    this.selectPortGroups$.unsubscribe();
    this.selectManagementPGs$.unsubscribe();
  }

  private loadPGsTable() {
    if (this.filterOption == 'all') {
      this.infoPanelTableComponent?.setRowData(this.portGroups);
    } else if (this.filterOption == 'selected') {
      this.infoPanelTableComponent?.setRowData(this.selectedPGs);
    } else if (this.filterOption === 'management') {
      this.infoPanelTableComponent?.setRowData(this.managementPGs);
    }
    this.infoPanelTableComponent?.deselectAll();
    this.infoPanelTableComponent?.setRowActive(this.selectedIds);
  }

  deletePortGroup() {
    this.infoPanelTableComponent?.delete();
  }

  editPortGroup() {
    this.infoPanelTableComponent?.edit();
  }

  exportPortGroup(format: ExportType) {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData: PortGroupExportModel = {
        pks: this.infoPanelTableComponent?.rowsSelectedIds as number[],
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
      const item = this.infoPanelTableComponent?.rowsSelectedIds.length === 1 ? 'this' : 'these';
      const sSuffix = this.infoPanelTableComponent?.rowsSelectedIds.length === 1 ? '' : 's';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Generate a new randomize subnet for ${item} port_group${sSuffix}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.randomizeSubnetPortGroups(this.infoPanelTableComponent?.rowsSelectedIds as number[], Number(this.projectId));
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
    this.filterOption = $event.value;
    this.loadPGsTable();
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
