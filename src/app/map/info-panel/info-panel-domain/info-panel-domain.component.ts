import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { DomainService } from "../../../core/services/domain/domain.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../project/services/project.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../../core/services/domain-user/domain-user.service";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { DomainUserDialogComponent } from "./domain-user-dialog/domain-user-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddDomainUserDialogComponent } from "./add-domain-user-dialog/add-domain-user-dialog.component";
import { DomainBulkEditDialogComponent } from "../../bulk-edit-dialog/domain-bulk-edit-dialog/domain-bulk-edit-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";

@Component({
  selector: 'app-info-panel-domain',
  templateUrl: './info-panel-domain.component.html',
  styleUrls: ['./info-panel-domain.component.scss']
})
export class InfoPanelDomainComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() infoPanelheight = '300px';
  projectId = 0;
  selectDomains$ = new Subscription();
  domains!: any;
  tabName = 'domain';
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
        minWidth: 400,
        flex: 1,
      },
      {
        headerName: 'Admin User',
        field: 'admin_user',
        minWidth: 400,
        flex: 1,
      },
      {
        headerName: 'Admin Password',
        field: 'admin_password',
        minWidth: 300,
        flex: 1,
      }
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data
    };
    this.dialog.open(AddUpdateDomainDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegister: MatIconRegistry,
    private helpers: HelpersService,
    private domainService: DomainService,
    private projectService: ProjectService,
    private infoPanelService: InfoPanelService,
    private domainUserService: DomainUserService
  ) {
    iconRegister.addSvgIcon('add-user', this.helpers.setIconPath('/assets/icons/add-user.svg'))
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      if (domains) {
        this.domains = domains;
        this.infoPanelTableComponent?.setRowData(domains);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedIds);
      }
    });
  }

  ngOnDestroy(): void {
    this.selectDomains$.unsubscribe();
  }

  ngOnInit(): void {
    this.projectId = this.projectService.getProjectId();
  }

  addDomain() {
    const dialogData = {
      mode: 'add',
      genData: {
        name: '',
        project_id: this.projectId,
        admin_user: '',
        admin_password: ''
      }
    };
    this.dialog.open(AddUpdateDomainDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

  addDomainUser() {
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 0) {
      this.toastr.info('Please select the domain for creating users');
    } else {
      const dialogData = {
        genData: { domainId: this.infoPanelTableComponent?.rowsSelectedIds }
      }
      this.dialog.open(AddDomainUserDialogComponent, { disableClose: true, width: '600px', data: dialogData });
    }
  }

  editDomain() {
    if (this.infoPanelTableComponent?.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else if (this.infoPanelTableComponent?.rowsSelected.length == 1) {
      this.domains.find((ele: any) => ele.id === this.infoPanelTableComponent?.rowsSelected[0].id)
      this.domainService.get(this.infoPanelTableComponent?.rowsSelected[0].id).subscribe(domainData => {
        const dialogData = {
          mode: 'update',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      })
    } else {
      const dialogData = {
        genData: {
          pks: this.infoPanelTableComponent?.rowsSelectedIds,
          projectId: this.projectId
        }
      }
      this.dialog.open(DomainBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
    }
  }

  deleteDomain() {
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.infoPanelTableComponent?.rowsSelectedIds.length === 1 ? 'this' : 'these';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '450px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent && this.infoPanelTableComponent.rowsSelectedIds.length > 0) {
          this.infoPanelService.deleteDomains(this.infoPanelTableComponent.rowsSelectedIds, this.projectId);
          this.clearRowSelected();
        }
      })

    }
  }

  exportDomain(format: string) {
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        domain_id: this.infoPanelTableComponent?.rowsSelectedIds,
        format: format
      }
      let file = new Blob();
      this.domainService.export(jsonData).subscribe(response => {
        if (format === 'json') {
          file = new Blob([response.data], { type: 'application/json' });
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Export domains as ${format.toUpperCase()} successfully`);
      })
    }
  }

  validateDomain() {
    this.infoPanelTableComponent?.validate();
  }

  openDomainUsers() {
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 1) {
      this.domainUserService.getDomainUserByDomainId(this.infoPanelTableComponent?.rowsSelectedIds[0]).subscribe(data => {
        const dialogData = {
          genData: data.result,
          domain: this.infoPanelTableComponent?.rowsSelected[0]
        }
        this.dialog.open(DomainUserDialogComponent,
          { disableClose: true, width: `${screen.width}px`, height: `${screen.height * .85}px`, data: dialogData });
      })
    } else {
      this.toastr.info('Please select only one domain to open the domain user list!', 'Info');
    }
  }

  clearRowSelected() {
    this.infoPanelTableComponent?.deselectAll();
  }
}
