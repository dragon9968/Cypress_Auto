import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, Observable, of, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedPermissions, retrievedRole } from 'src/app/store/user/user.actions';
import { selectRole } from 'src/app/store/user/user.selectors';
import { AddEditRoleDialogComponent } from './add-edit-role-dialog/add-edit-role-dialog.component';
import { CloneRoleDialogComponent } from './clone-role-dialog/clone-role-dialog.component';
import { ExportRoleDialogComponent } from './export-role-dialog/export-role-dialog.component';
import { ImportRoleDialogComponent } from './import-role-dialog/import-role-dialog.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  quickFilterValue = '';
  rowData$!: Observable<any[]>;
  private gridApi!: GridApi;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  selectRole$ = new Subscription();

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  }

  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'name',
      maxWidth: 200,
      flex: 1
    },
    {
      field: 'permissions',
      flex: 1,
      autoHeight: true,
      wrapText: true,
      cellRenderer: function(params: any) {
        if (params.value.length > 0){
          let html_str = "<div style='text-align:left'>["
          for(let i in params.value) {
            let item_html = `${params.value[i].detail},`;
            html_str += item_html;
          }
          html_str = html_str.slice(0, html_str.lastIndexOf(','))
          html_str += "]</div>"
          return html_str;
        } else {
          return "<div>[]</div>"
        }
        // return `[${params.value.map((val: any) => val.detail).join(',')}]`;
      }
    }
  ];

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    iconRegistry: MatIconRegistry,
    private rolesService: RolesService,
    private store: Store,
  ) { 
    this.selectRole$ = this.store.select(selectRole).subscribe(roleData => {
      if (roleData) {
        if (this.gridApi) {
          this.gridApi.setRowData(roleData);
        } else {
          this.rowData$ = of(roleData);
        }
        this.updateRow();
      }
    })
    
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
  }

  ngOnInit(): void {
    this.rolesService.getAll().subscribe(data => this.store.dispatch(retrievedRole({ role: data.result })));
    this.rolesService.getPermissions().subscribe(data => this.store.dispatch(retrievedPermissions({ permissions: data.result })));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(el => el.id);
  }

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  addRoles() {
    const dialogData = {
      mode: 'add',
      genData: {
        name: '',
      }
    }
    this.dialog.open(AddEditRoleDialogComponent, {
      autoFocus: false,
      width: '800px',
      data: dialogData
    });
  }

  editRoles() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.rolesService.get(this.rowsSelectedId[0]).subscribe(roleData => {
        const dialogData = {
          mode: 'update',
          genData: roleData.result
        }
        this.dialog.open(AddEditRoleDialogComponent, {
          autoFocus: false,
          width: '800px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to role.<br> Please select only one piece of role.',
        'Info', { enableHtml: true });
    }
  }

  deleteRoles() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          forkJoin(this.rowsSelectedId.map(id => {
            return this.rolesService.delete(id).pipe(
              catchError((response: any) => {
                if (response.status == 400) {
                  this.toastr.error(response.error.message.split(':')[1], 'Error');
                } else {
                  this.toastr.error('Delete roles failed', 'Error');
                }
                return throwError(() => response.error);
              })
            );
          })).subscribe(() => {
            this.toastr.success('Deleted role(s) successfully', 'Success');
            this.rolesService.getAll().subscribe(
              data => this.store.dispatch(retrievedRole({role: data.result}))
            );
            this.clearRow();
          })
        }
      })
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelected = [];
    this.rowsSelectedId = [];
  }

  importRoles() {
    const dialogRef = this.dialog.open(ImportRoleDialogComponent, {
      autoFocus: false,
      width: '450px',
    });
  }

  exportRoles() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      this.rolesService.get(this.rowsSelectedId[0]).subscribe(data => {
        const dialogData = {
          pks: this.rowsSelectedId,
          name: data.result.name,
        }
        this.dialog.open(ExportRoleDialogComponent, {
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    }
  }

  cloneRoles() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.rolesService.get(this.rowsSelectedId[0]).subscribe(roleData => {
        const dialogData = {
          pk: this.rowsSelectedId[0],
          name: roleData.result.name
        }
        this.dialog.open(CloneRoleDialogComponent, {
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to role.<br> Please select only one piece of role.',
        'Info', { enableHtml: true });
    }
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
}
