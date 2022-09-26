import { Store } from "@ngrx/store";
import { Observable, of, Subscription } from "rxjs";
import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { DomainService } from "../../../core/services/domain/domain.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { selectDomains } from "../../../store/domain/domain.selectors";

@Component({
  selector: 'app-info-panel-domain',
  templateUrl: './info-panel-domain.component.html',
  styleUrls: ['./info-panel-domain.component.scss']
})
export class InfoPanelDomainComponent implements OnInit {

  private gridApi!: GridApi;
  collectionId: string = '0';
  name: string = '';
  selectDomains$ = new Subscription();
  rowsSelected: any[] = [];
  rowData$!: Observable<any[]>;

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
        width: 500
      },
      {
        field: 'admin_user',
        suppressSizeToFit: true,
        minWidth: 400,
        width: 500
      },
      {
        field: 'admin_password',
        suppressSizeToFit: true,
        minWidth: 300,
        width: 400
      }
    ]
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private domainService: DomainService
  ) {
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      if (domains) {
        this.rowData$ = of(domains);
      }
    });
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
}
