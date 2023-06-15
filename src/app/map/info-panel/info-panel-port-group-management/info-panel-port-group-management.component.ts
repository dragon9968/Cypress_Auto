import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectPortGroupsManagement } from "../../../store/portgroup/portgroup.selectors";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { retrievedPortGroupsManagement } from "../../../store/portgroup/portgroup.actions";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { PortGroupExportModel, PortGroupRandomizeSubnetModel } from "../../../core/models/port-group.model";
import { ExportType } from "../../../core/models/common.model";

@Component({
  selector: 'app-info-panel-port-group-management',
  templateUrl: './info-panel-port-group-management.component.html',
  styleUrls: ['./info-panel-port-group-management.component.scss']
})
export class InfoPanelPortGroupManagementComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  tabName = 'portGroupManagement';
  projectId = '0';
  selectPortGroupsManagement = new Subscription();
  portGroupsManagement: any[] = [];
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
        cellRenderer: (param: any) => {
          let html_str = "<ul>";
          param.value?.forEach((i: any) => {
            const item_html = `<li>${i.value}</li>`
            html_str += item_html
          });
          html_str += "</ul>"
          return html_str != '<ul></ul>' ? html_str : '';
        },
        cellClass: 'row-interface',
        autoHeight: true
      }
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy,
      tabName: this.tabName
    }
    this.dialog.open(AddUpdatePGDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
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
    this.selectPortGroupsManagement = this.store.select(selectPortGroupsManagement).subscribe(pgsManagement => {
      if (pgsManagement) {
        this.portGroupsManagement = pgsManagement;
        this.infoPanelTableComponent?.setRowData(pgsManagement);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedId);
      }
    })
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
  }

  ngOnDestroy(): void {
    this.selectPortGroupsManagement.unsubscribe();
  }

  deletePortGroup() {
    if (this.infoPanelTableComponent?.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Delete port_group(s) from this switch?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          const newPGsManagement = [...this.portGroupsManagement];
          this.portGroupsManagement.map(portGroup => {
            if (this.infoPanelTableComponent?.rowsSelectedId.includes(portGroup.pg_id)) {
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
          this.store.dispatch(retrievedPortGroupsManagement({ data: newPGsManagement }))
        }
      })
    }
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
          const jsonData: PortGroupRandomizeSubnetModel = {
            pks: this.infoPanelTableComponent?.rowsSelectedId as number[],
            project_id: Number(this.projectId)
          }
          this.portGroupService.randomizeSubnetBulk(jsonData).pipe(
            catchError((e: any) => {
              this.toastr.error(e.error.message);
              return throwError(() => e);
            })
          ).subscribe(response => {
            this.toastr.success(response.message);
            const newPGsManagement = this.infoPanelService.getNewPortGroupsManagement(response.result);
            this.infoPanelService.updateInterfaceIPBasedOnPGId(this.infoPanelTableComponent?.rowsSelectedId);
            this.store.dispatch(retrievedPortGroupsManagement({ data: newPGsManagement }));
          })
        }
      })
    }
  }

  validatePortGroup() {
    this.infoPanelTableComponent?.validate();
  }

  clearRow() {
    this.infoPanelTableComponent?.deselectAll();
  }
}
