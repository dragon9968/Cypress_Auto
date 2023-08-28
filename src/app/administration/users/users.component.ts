import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedRoles, retrievedUsers } from 'src/app/store/user/user.actions';
import { selectUsers } from 'src/app/store/user/user.selectors';
import { AddEditUserDialogComponent } from './add-edit-user-dialog/add-edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  selectUser$ = new Subscription();
  rowData$!: Observable<any[]>;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  private gridApi!: GridApi;
  quickFilterValue = '';
  listRole!: any[];
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    {
      field: 'first_name',
      headerName: 'First Name',
    },
    {
      headerName: 'Last Name',
      field: 'last_name',
    },
    {
      headerName: 'User Name',
      field: 'username'
    },
    {
      field: 'email'
    },
    {
      field: 'active'
    },
    {
      field: 'roles',
      headerName: 'Role',
      valueGetter: (params: any) => `[${params.data.roles.map((val: any) => val.name).join(',')}]`
    },
  ];
  constructor(
    private store: Store,
    private userService: UserService,
    private rolesService: RolesService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
    this.selectUser$ = this.store.select(selectUsers).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
  }

  ngOnInit(): void {
    this.userService.getAll().subscribe(data => this.store.dispatch(retrievedUsers({ users: data.result })))
    this.rolesService.getAll().subscribe(role => this.store.dispatch(retrievedRoles({ roles: role.result })))
  }

  ngOnDestroy(): void {
    this.selectUser$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  updateRow() {
    if (this.gridApi && this.rowsSelectedId.length > 0) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  addUser() {
    const dialogData = {
      mode: 'add',
      genData: {
        first_name: '',
        last_name: '',
        username: '',
        active: false,
        email: '',
        roles: '',
        password: ''
      }
    }
    this.dialog.open(AddEditUserDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '600px',
      data: dialogData
    });
  }

  editUser() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.userService.get(this.rowsSelectedId[0]).subscribe(data => {
        const dialogData = {
          mode: 'update',
          genData: data.result
        }
        this.dialog.open(AddEditUserDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '600px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to user.<br> Please select only one user',
        'Info', { enableHtml: true });
    }
  }

  deleteUser() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(this.rowsSelectedId.map(id => {
            return this.userService.delete(id).pipe(
              catchError((e: any) => {
                this.toastr.error(e.error.message);
                return throwError(() => e);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted User(s) successfully', 'Success');
            this.userService.getAll().subscribe((data: any) => this.store.dispatch(retrievedUsers({ users: data.result })));
            this.clearRow();
          })
        }
      })
    }
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.userService.get(row.data.id).subscribe(respData => {
      const dialogData = {
        mode: 'view',
        genData: respData.result
      }
      this.dialog.open(AddEditUserDialogComponent, {
        disableClose: true,
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    })
  }

  resetPassword() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.userService.get(this.rowsSelectedId[0]).subscribe(data => {
        const dialogData = {
          genData: data.result
        }
        this.dialog.open(ResetPasswordDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '500px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to user.<br> Please select only one user',
        'Info', { enableHtml: true });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }
}
