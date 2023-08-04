import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Observable, of, Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CellValueChangedEvent, GridApi, GridOptions, GridReadyEvent, ValueSetterParams } from "ag-grid-community";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../../../core/services/domain-user/domain-user.service";
import { selectIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.selectors";
import { retrievedIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.actions";
import { ConfirmationDialogComponent } from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";

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
  rowsSelectedIds: any[] = [];
  domain: any;
  tabName = 'domainUser';

  public gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true,
      editable: true
    },
    rowSelection: 'multiple',
    suppressRowDeselection: true,
    onCellValueChanged: this.onCellValueChanged.bind(this),
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
        editable: false
      },
      {
        field: 'id',
        hide: true
      },
      {
        headerName: 'First Name',
        field: 'firstname',
        valueSetter: this.setFirstName.bind(this),
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Last Name',
        field: 'lastname',
        valueSetter: this.setLastName.bind(this),
        minWidth: 150,
        flex: 1,
      },
      {
        headerName: 'Username',
        field: 'username',
        valueSetter: this.setUsername.bind(this),
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
        valueSetter: this.setUpn.bind(this),
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
        valueSetter: this.setPostalCode.bind(this),
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
    private infoPanelService: InfoPanelService,
    private helpersService: HelpersService
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

  setFirstName(params: ValueSetterParams) {
    const newValue = params.newValue;
    const isValueRequired = this.helpersService.validateRequiredInCell(newValue);
    if (!isValueRequired) return false;
    const isValueCharacter = this.helpersService.validateCharacterInCell(newValue);
    if (!isValueCharacter) return false;
    const isValueInRange = this.helpersService.validateLengthRangeInCell(newValue, 2, 20);
    if (!isValueInRange) return false;
    const data = params.data;
    data.firstname = params.newValue;
    return true;
  }

  setLastName(params: ValueSetterParams) {
    const newValue = params.newValue;
    const isValueRequired = this.helpersService.validateRequiredInCell(newValue);
    if (!isValueRequired) return false;
    const isValueCharacter = this.helpersService.validateCharacterInCell(newValue);
    if (!isValueCharacter) return false;
    const isValueInRange = this.helpersService.validateLengthRangeInCell(newValue, 2, 20);
    if (!isValueInRange) return false;
    const data = params.data;
    data.lastname = params.newValue;
    return true;
  }

  setUsername(params: ValueSetterParams) {
    const isValueRequired = this.helpersService.validateRequiredInCell(params.newValue);
    if (!isValueRequired) return false;
    let isExistUsername = false;
    const data = params.data;
    this.gridApi.forEachNode((rowNode: any) => {
      if (rowNode.data.username === params.newValue) {
        this.toastr.error(`Already exists ${params.newValue} username.<br>Please enter a different username`,
          'Error', { enableHtml: true });
        isExistUsername = true;
      }
    })
    if (isExistUsername) {
      return false;
    } else {
      data.username = params.newValue;
      return true;
    }
  }

  setUpn(params: ValueSetterParams) {
    const newValue = params.newValue;
    const isValueRequired = this.helpersService.validateRequiredInCell(newValue);
    if (!isValueRequired) {
      return false;
    } else {
      const data = params.data;
      data.upn = newValue;
      return true;
    }
  }

  setPostalCode(params: ValueSetterParams) {
    const newValue = params.newValue;
    const isValueNumber = this.helpersService.validateNumberInCell(newValue);
    if (!isValueNumber) {
      return false;
    } else {
      const data = params.data;
      data.postal_code = newValue;
      return true;
    }
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

  selectRow() {
    this.rowSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedIds = this.rowSelected.map(ele => ele.id);
  }

  editDomainUser() {
    if (this.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedIds.includes(rowNode.data.id)) {
          const domainUser = rowNode.data;
          const jsonDataValue = {
            firstname: domainUser.firstname,
            lastname: domainUser.lastname,
            username: domainUser.username,
            password: domainUser.password ? domainUser.password : 'P@ssw0rd123',
            company: domainUser.company,
            upn: domainUser.upn ? domainUser.upn :`${domainUser.username}@${this.data.domain.name}`,
            email: domainUser.email,
            street_address: domainUser.street_address,
            city: domainUser.city,
            state_province: domainUser.state_province,
            postal_code: domainUser.postal_code,
            country: domainUser.country
          }
          const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
          this.domainUserService.put(domainUser.id, jsonData).subscribe({
            next: () => {
              this.store.dispatch(retrievedIsChangeDomainUsers({ isChangeDomainUsers: true }));
              this.toastr.success('Updated Row');
              this.clearRowSelected();
            },
            error: err => {
              this.toastr.error('Update Row Failed');
              throwError(() => err);
            }
          })
        }
      })
    }
  }

  deleteDomainUser() {
    if (this.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedIds.length === 1 ? 'this' : 'these';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {disableClose: true, width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.rowsSelectedIds.map(id => this.infoPanelService.deleteDomainUser(id));
          this.clearRowSelected();
        }
      })
    }
  }

  setRowActive() {
    if (this.rowsSelectedIds.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedIds.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  clearRowSelected() {
    this.rowsSelectedIds = [];
    this.rowSelected = [];
    this.gridApi.deselectAll();
  }

  onCellValueChanged(event: CellValueChangedEvent) {
    event.node.setSelected(true);
    this.selectRow();
  }
}
