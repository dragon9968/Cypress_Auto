import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';
import { selectLoginProfiles } from 'src/app/store/login-profile/login-profile.selectors';
import { ActionsRenderComponent } from './actions-render/actions-render.component';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MatDialog } from '@angular/material/dialog';
import { EditLoginProfilesDialogComponent } from './edit-login-profiles-dialog/edit-login-profiles-dialog.component';

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
      headerName: '',
      field: 'id',
      suppressSizeToFit: true,
      width: 160,
      cellRenderer: ActionsRenderComponent,
      cellClass: 'login-profiles-actions',
      sortable: false
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
        }else {
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
      this.rowData$ = of(data);
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

  onQuickFilterInput(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  exportCSV() {
    if (this.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.loginProfileService.exportCSV(this.rowsSelectedId).subscribe(response => {
        file = new Blob([response], {type: 'text/csv;charset=utf-8;'});
        this.helpers.downloadBlob('LoginProfile-Export.csv', file);
        this.toastr.success(`Exported Login Profile as ${'csv'.toUpperCase()} file successfully`);
      })
      this.gridApi.deselectAll();
    }
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
      this.gridApi.deselectAll();
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
    const dialogRef = this.dialog.open(EditLoginProfilesDialogComponent, {
      width: '450px',
      data: dialogData
    });
  }
}
