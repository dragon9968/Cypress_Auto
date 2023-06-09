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
import { ActionRenderersComponent } from '../action-renderers/action-renderers.component';
import { AddEditRoleDialogComponent } from './add-edit-role-dialog/add-edit-role-dialog.component';
import { CloneRoleDialogComponent } from './clone-role-dialog/clone-role-dialog.component';
import { ExportRoleDialogComponent } from './export-role-dialog/export-role-dialog.component';
import { ImportRoleDialogComponent } from './import-role-dialog/import-role-dialog.component';
import { ImportDialogComponent } from 'src/app/shared/components/import-dialog/import-dialog.component';
import { PageName } from 'src/app/shared/enums/page-name.enum';

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
  rolesHasProtected: any[] = [];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  }

  columnDefs: ColDef[] = [
    {
      headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ActionRenderersComponent,
      cellRendererParams: {
        onClick: this.setRowHeight.bind(this),
      }
    },
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'name',
      maxWidth: 200,
      flex: 1,
      cellRenderer: (params: any) => {
        let eIconGui = document.createElement('span');
        if (this.rolesHasProtected.indexOf(params.value) > -1) {
          return  eIconGui.innerHTML = '<em class="material-icons" style="position: absolute; top:10px; left:0px;">lock</em>'  + ' ' + params.value;
        }
        else {
          return params.value;
        }
      }
    },
    {
      field: 'permissions',
      flex: 1,
      // autoHeight: true,
      wrapText: true,
      cellRenderer: function(params: any) {
        if (params.value.length > 0) {
          let html_str = "<div style='width: 30%; margin-left:auto; margin-right:auto;'><ul>"
          for(let i in params.value) {
            let item_html = `<li style='text-align: left'>${params.value[i].detail}</li>`;
            html_str += item_html;
          }
          html_str += "</ul></div>"
          return html_str;
        } else {
          return
        }
      },
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
    this.rolesService.getRolesProtected().subscribe(data => this.rolesHasProtected = data.roles.map((role: any) => role.name));
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
    let selectedRows = this.gridApi.getSelectedRows()
    let selectedRowsCount = selectedRows.length;

    if (selectedRowsCount > 0) {
      if (this.rolesHasProtected.indexOf(selectedRows[0]["name"]) > -1) {
        this.toastr.warning('The [' + selectedRows[0]["name"] + '] role is currently protected', 'Warning')
        this.gridApi.getSelectedNodes()[0].setSelected(false)
      }
      else {
        this.rowsSelected = this.gridApi.getSelectedRows();
        this.rowsSelectedId = this.rowsSelected.map(el => el.id);
      }
    }
    else {
      this.rowsSelected = this.gridApi.getSelectedRows();
      this.rowsSelectedId = this.rowsSelected.map(el => el.id);
    }
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
      disableClose: true,
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
          disableClose: true,
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
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
    const dialogData = {
      pageName: PageName.ROLES
    }
    this.dialog.open(ImportDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
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
          disableClose: true,
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
          disableClose: true,
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

  setRowHeight(params: any) {
    const rowDefault = params.rowData.node.data.permissions.length
    const row = rowDefault * 42 > 42 ? rowDefault * 42 : 42
    this.gridApi!.forEachNode(function (rowNode) {
      if (rowNode.data && rowNode.data.name === params.rowData.node.data.name) {
        if (params.position) {
          rowNode.setRowHeight(row);
        } else {
          rowNode.setRowHeight(42);
        }
      }
    });
    this.gridApi.onRowHeightChanged();
  }
}
