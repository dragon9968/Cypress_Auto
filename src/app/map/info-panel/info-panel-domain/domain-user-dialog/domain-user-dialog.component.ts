import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Observable, of, Subscription } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../../../core/services/domain-user/domain-user.service";
import { selectIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.selectors";
import { retrievedIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.actions";
import { ConfirmationDialogComponent } from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";


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
  rowSelected: any[] = [];
  rowsSelectedId: any[] = [];
  domain: any;
  tabName = 'domainUser';

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
        headerName: 'First Name',
        field: 'firstname',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Last Name',
        field: 'lastname',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Username',
        field: 'username',
        minWidth: 300,
        flex: 1,
      },
      {
        headerName: 'Password',
        field: 'password',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'company',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'UPN',
        field: 'upn',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'email',
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: 'Street Address',
        field: 'street',
        minWidth: 250,
        flex: 1,
      },
      {
        field: 'city',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'State/Province',
        field: 'state_province',
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Postal Code',
        field: 'postal_code',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'country',
        minWidth: 150,
        flex: 1,
      }
    ]
  };

  constructor(
    private store: Store,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private domainUserService: DomainUserService,
    private infoPanelService: InfoPanelService
  ) {
    this.domain = this.data.domain;
    this.rowData$ = of(this.convertDomainUsers(this.data.genData));
    this.isChangeDomainUsers$ = this.store.select(selectIsChangeDomainUsers).subscribe(isChange => {
      if (isChange) {
        this.domainUserService.getDomainUserByDomainId(this.domain.id).subscribe(data => {
          if (this.gridApi) {
            this.gridApi.setRowData(this.convertDomainUsers(data.result));
          } else {
            this.rowData$ = of(this.convertDomainUsers(data.result));
          }
          this.setRowActive();
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

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.infoPanelService.viewInfoPanel(this.tabName, row.data.id);
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

  selectRow() {
    this.rowSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowSelected.map(ele => ele.id);
  }

  editDomainUser() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.infoPanelService.openEditInfoPanelForm(undefined, this.tabName, this.rowsSelectedId[0]);
    } else {
      this.toastr.info('Bulk edit do not apply to the domain user.<br> Please select only one domain user',
                  'Info', {enableHtml: true});
    }
  }

  deleteDomainUser() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedId.length === 1 ? 'this' : 'those';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.deleteInfoPanelNotAssociateMap(this.tabName, this.rowsSelectedId);
          this.clearRowSelected();
        }
      })
    }
  }

  setRowActive() {
    if (this.rowsSelectedId.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  clearRowSelected() {
    this.rowsSelectedId = [];
    this.rowSelected = [];
    this.gridApi.deselectAll();
  }

}
