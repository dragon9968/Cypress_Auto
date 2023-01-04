import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription, throwError } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { DomainService } from "../../../core/services/domain/domain.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../../core/services/domain-user/domain-user.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { AddDomainUserDialogComponent } from "./add-domain-user-dialog/add-domain-user-dialog.component";
import { DomainBulkEditDialogComponent } from "../../bulk-edit-dialog/domain-bulk-edit-dialog/domain-bulk-edit-dialog.component";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { selectDomains } from "../../../store/domain/domain.selectors";
import { DomainUserDialogComponent } from "./domain-user-dialog/domain-user-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-info-panel-domain',
  templateUrl: './info-panel-domain.component.html',
  styleUrls: ['./info-panel-domain.component.scss']
})
export class InfoPanelDomainComponent implements OnInit, OnDestroy {
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  collectionId: string = '0';
  selectDomains$ = new Subscription();
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  domains!: any;
  isClickAction = false;
  rowData$!: Observable<any[]>;
  tabName = 'domain';
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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegister: MatIconRegistry,
    private helpers: HelpersService,
    private domainService: DomainService,
    private infoPanelService: InfoPanelService,
    private domainUserService: DomainUserService
  ) {
    iconRegister.addSvgIcon('add-user', this.helpers.setIconPath('/assets/icons/add-user.svg'))
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      if (domains) {
        this.domains = domains;
        if (this.gridApi) {
          this.gridApi.setRowData(domains);
        } else {
          this.rowData$ = of(domains);
        }
        this.updateRowDomainInfoPanel();
      }
    });
  }

  ngOnDestroy(): void {
    this.selectDomains$.unsubscribe();
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.domainService.getDomainByCollectionId(this.collectionId).subscribe((data: any) => this.store.dispatch(retrievedDomains({ data: data.result })));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data
    };
    this.dialog.open(AddUpdateDomainDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  addDomain() {
    const dialogData = {
      mode: 'add',
      genData: {
        name: '',
        collection_id: this.collectionId,
        admin_user: '',
        admin_password: ''
      }
    };
    this.dialog.open(AddUpdateDomainDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  addDomainUser() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('Please select the domain for creating users');
    } else {
      const dialogData = {
        genData: { domainId: this.rowsSelectedId }
      }
      this.dialog.open(AddDomainUserDialogComponent, { width: '600px', data: dialogData });
    }
  }

  editDomain() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelected.length == 1) {
      this.domains.find((ele: any) => ele.id === this.rowsSelected[0].id)
      this.domainService.get(this.rowsSelected[0].id).subscribe(domainData => {
        const dialogData = {
          mode: 'update',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      })
    } else {
      const dialogData = {
        genData: {
          pks: this.rowsSelectedId,
          collectionId: this.collectionId
        }
      }
      this.dialog.open(DomainBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
    }
  }

  deleteDomain() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedId.length === 1 ? 'this' : 'these';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { width: '450px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.deleteInfoPanelNotAssociateMap(this.tabName, this.rowsSelectedId);
          this.clearRowSelected();
        }
      })

    }
  }

  exportDomain(format: string) {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        domain_id: this.rowsSelectedId,
        format: format
      }
      let file = new Blob();
      this.domainService.export(jsonData).subscribe(response => {
        if (format === 'json') {
          file = new Blob([response.data], { type: 'application/json' });
        } else if (format === 'csv') {
          file = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Export domains as ${format.toUpperCase()} successfully`);
      })
    }
  }

  validateDomain() {
    if (this.rowsSelected.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        domain_id: this.rowsSelectedId
      }
      this.domainService.validate(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(response => {
        this.toastr.success(response.message);
      })
    }
  }

  updateRowDomainInfoPanel() {
    if (this.rowsSelectedId.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  openDomainUsers() {
    if (this.rowsSelectedId.length === 1) {
      this.domainUserService.getDomainUserByDomainId(this.rowsSelectedId[0]).subscribe(data => {
        const dialogData = {
          genData: data.result,
          domain: this.rowsSelected[0]
        }
        this.dialog.open(DomainUserDialogComponent,
          { width: `${screen.width}px`, height: `${screen.height * .85}px`, data: dialogData });
      })
    } else {
      this.toastr.info('Please select only one domain to open the domain user list!', 'Info');
    }
  }

  clearRowSelected() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.deselectAll();
  }
}
