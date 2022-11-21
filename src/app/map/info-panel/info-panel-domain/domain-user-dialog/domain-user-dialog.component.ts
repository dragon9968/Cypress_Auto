import { Store } from "@ngrx/store";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable, of, Subscription } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { DomainUserService } from "../../../../core/services/domain-user/domain-user.service";
import { InfoPanelRenderComponent } from "../../info-panel-render/info-panel-render.component";
import { selectIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.selectors";
import { retrievedIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.actions";


@Component({
  selector: 'app-domain-user-dialog',
  templateUrl: './domain-user-dialog.component.html',
  styleUrls: ['./domain-user-dialog.component.scss']
})
export class DomainUserDialogComponent implements OnInit, OnDestroy {

  private gridApi!: GridApi;
  domainUsers: any[] = [];
  rowData$!: Observable<any[]>;
  isChangeDomainUsers$ = new Subscription();
  domain: any;

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
        headerName: 'Actions',
        field: 'id',
        suppressSizeToFit: true,
        width: 150,
        cellRenderer: InfoPanelRenderComponent,
        cellClass: 'domain-users-actions',
        cellRendererParams: {
          tabName: 'domainUser',
          getExternalParams: () => this
        },
        sortable: false
      },
      {
        headerName: 'First Name',
        field: 'firstname',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Last Name',
        field: 'lastname',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Username',
        field: 'username',
        suppressSizeToFit: true,
        minWidth: 300,
        flex: 1,
      },
      {
        headerName: 'Password',
        field: 'password',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'company',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'UPN',
        field: 'upn',
        suppressSizeToFit: true,
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'email',
        suppressSizeToFit: true,
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: 'Street Address',
        field: 'street',
        suppressSizeToFit: true,
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'city',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'State/Province',
        field: 'state_province',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Postal Code',
        field: 'postal_code',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'country',
        suppressSizeToFit: true,
        minWidth: 150,
        flex: 1,
      }
    ]
  };

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domainUserService: DomainUserService
  ) {
    this.domain = this.data.domain;
    this.rowData$ = of(this.convertDomainUsers(this.data.genData));
    this.isChangeDomainUsers$ = this.store.select(selectIsChangeDomainUsers).subscribe(isChange => {
      if (isChange) {
        this.domainUserService.getDomainUserByDomainId(this.domain.id).subscribe(data => {
          this.rowData$ = of(this.convertDomainUsers(data.result));
          this.store.dispatch(retrievedIsChangeDomainUsers({isChangeDomainUsers: false}));
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.isChangeDomainUsers$.unsubscribe();
  }

  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  convertDomainUsers(data: any) {
    return data.map((ele: any) => ({
      id: ele.id,
      firstname: ele.firstname,
      lastname: ele.lastname,
      username: ele.username,
      password: ele.configuration?.password ? ele.configuration?.password : 'P@ssw0rd123',
      company: ele.configuration?.company,
      upn: ele.configuration?.upn ? ele.configuration?.upn : `${ele.username}@${this.data.domain.name}`,
      email: ele.configuration?.email,
      street: ele.configuration?.address?.street,
      city: ele.configuration?.address?.city,
      state_province: ele.configuration?.address?.state_province,
      postal_code: ele.configuration?.address?.postal_code,
      country: ele.configuration?.address?.country,
    }))
  }
}
