import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';
import { selectLoginProfiles } from 'src/app/store/login-profile/login-profile.selectors';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MatDialog } from '@angular/material/dialog';
import { EditLoginProfilesDialogComponent } from './edit-login-profiles-dialog/edit-login-profiles-dialog.component';
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-login-profiles',
  templateUrl: './login-profiles.component.html',
  styleUrls: ['./login-profiles.component.scss']
})
export class LoginProfilesComponent implements OnInit, OnDestroy {
  quickFilterValue = '';
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  routeSegments = RouteSegments;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private selectLoginProfiles$ = new Subscription();
  private gridApi!: GridApi;
  rowData$!: Observable<any[]>;
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
    { field: 'name'},
    {
      field: 'description',
      suppressSizeToFit: true,
    },
    { field: 'username'},
    { field: 'password'},
    {
      headerName: 'Extra Args',
      field: 'extra_args',
      sortable: false,
      cellRenderer: function(param: any) {
        if (param.value.length > 0){
          let html_str = "<div>["
          for(let i in param.value) {
            let item_html = `'${param.value[i]}',`;
            html_str += item_html;
          }
          html_str = html_str.slice(0, html_str.lastIndexOf(','))
          html_str += "]</div>"
          return html_str;
        } else {
          return "<div>[]</div>"
        }
      }
    }
  ];

  constructor(
    private loginProfileService: LoginProfileService,
    private store: Store,
    private toastr: ToastrService,
    private helpers: HelpersService,
    iconRegistry: MatIconRegistry,
    private dialog: MatDialog,
  ) {
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe((data: any) => {
      if (data) {
        if (this.gridApi) {
          this.gridApi.setRowData(data);
        } else {
          this.rowData$ = of(data);
        }
        this.updateRow();
      }
    });
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
  }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
  }

  ngOnInit(): void {
    this.loginProfileService.getAll().subscribe((data: any) => this.store.dispatch(retrievedLoginProfiles({data: data.result})));
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
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

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  exportJson() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.loginProfileService.exportJson(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('LoginProfile-Export.json', file);
        this.toastr.success(`Exported Login Profile as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  addLoginProfile() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        description: '',
        username:  '',
        password: '',
        category:  'local',
        extra_args: '',
      }
    }
    this.dialog.open(EditLoginProfilesDialogComponent, {
      hasBackdrop: false,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.loginProfileService.getById(row.data.id).subscribe(loginData => {
      const dialogData = {
        mode: 'view',
        genData: loginData.result
      }
      this.dialog.open(EditLoginProfilesDialogComponent, {
        hasBackdrop: false,
        autoFocus: false,
        width: '450px',
        data: dialogData
      });
    })
  }

  updateLoginProfiles() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.loginProfileService.getById(this.rowsSelectedId[0]).subscribe(loginData => {
        const dialogData = {
          mode: 'update',
          genData: loginData.result
        }
        this.dialog.open(EditLoginProfilesDialogComponent, {
          hasBackdrop: false,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to login profiles.<br> Please select only one login profile',
        'Info', { enableHtml: true });
    }

  }

  deleteLoginProfiles() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { hasBackdrop: false, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowsSelected.map(loginProfile => {
            this.loginProfileService.delete(loginProfile.id).pipe(
              catchError((error: any) => {
                if (error.status == 422) {
                  this.toastr.warning('Associated data exists, please delete them first', 'Warning');
                }
                return throwError(() => error)
              })
            ).subscribe( () => {
              this.loginProfileService.getAll().subscribe((data: any) => this.store.dispatch(retrievedLoginProfiles({data: data.result})));
              this.clearRow();
              this.toastr.success(`Deleted ${loginProfile.name} login profile successfully`, 'Success');
            })
          })
        }
      })
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelectedId = [];
    this.rowsSelected = [];
  }
}
