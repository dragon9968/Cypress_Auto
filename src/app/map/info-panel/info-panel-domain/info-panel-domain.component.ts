import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { Observable, of, Subscription, throwError } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { DomainService } from "../../../core/services/domain/domain.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { AddDomainUserDialogComponent } from "./add-domain-user-dialog/add-domain-user-dialog.component";
import { DomainBulkEditDialogComponent } from "../../bulk-edit-dialog/domain-bulk-edit-dialog/domain-bulk-edit-dialog.component";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { selectDomains } from "../../../store/domain/domain.selectors";

@Component({
  selector: 'app-info-panel-domain',
  templateUrl: './info-panel-domain.component.html',
  styleUrls: ['./info-panel-domain.component.scss']
})
export class InfoPanelDomainComponent implements OnInit {
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  collectionId: string = '0';
  selectDomains$ = new Subscription();
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  domains!: any;
  rowData$!: Observable<any[]>;
  isClickAction = false;

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
        width: 200,
        cellRenderer: InfoPanelRenderComponent,
        cellClass: 'domain-actions',
        cellRendererParams: {
          tabName: 'domain',
          getExternalParams: () => this
        }
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 400,
        flex: 1,
      },
      {
        headerName: 'Admin User',
        field: 'admin_user',
        suppressSizeToFit: true,
        minWidth: 400,
        flex: 1,
      },
      {
        headerName: 'Admin Password',
        field: 'admin_password',
        suppressSizeToFit: true,
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
    private infoPanelService: InfoPanelService
  ) {
    iconRegister.addSvgIcon('add-user', this.helpers.setIconPath('/assets/icons/add-user.svg'))
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      if (domains) {
        this.domains = domains;
        this.rowData$ = of(domains);
      }
    });
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber-100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.domainService.getDomainByCollectionId(this.collectionId).subscribe((data: any) => this.store.dispatch(retrievedDomains({data: data.result})));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
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
    this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', data: dialogData});
  }

  addDomainUser() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('Please select the domain for creating users');
    } else {
      const dialogData = {
        genData: { domainId: this.rowsSelectedId }
      }
      this.dialog.open(AddDomainUserDialogComponent, {width: '600px', data: dialogData});
      this.gridApi.deselectAll();
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
        this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', data: dialogData});
      })
    } else {
      const dialogData = {
        genData: {
          pks: this.rowsSelectedId,
          collectionId: this.collectionId
        }
      }
      this.dialog.open(DomainBulkEditDialogComponent, { width: '600px', data: dialogData });
    }
  }

  deleteDomain() {
    this.rowsSelected.map(domain => {
      this.infoPanelService.deleteDomain(domain, this.collectionId);
    })
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
          file = new Blob([response.data], { type: 'text/csv;charset=utf-8;'})
        }
        const fileName = response.filename;
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Export domains as ${format.toUpperCase()} successfully`);
      })
      this.gridApi.deselectAll();
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
      this.gridApi.deselectAll();
    }
  }

}
