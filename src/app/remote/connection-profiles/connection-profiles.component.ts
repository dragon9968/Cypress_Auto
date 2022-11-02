import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { MatIconRegistry } from "@angular/material/icon";
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, of, Subscription } from 'rxjs';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { selectServerConnect } from 'src/app/store/server-connect/server-connect.selectors';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConnectionActionsRendererComponent } from '../renderers/connection-actions/connection-actions-renderer.component';
import { ConnectionStatusRendererComponent } from '../renderers/connection-status/connection-status-renderer.component';

@Component({
  selector: 'app-connection-profiles',
  templateUrl: './connection-profiles.component.html',
  styleUrls: ['./connection-profiles.component.scss']
})
export class ConnectionProfilesComponent implements OnInit, OnDestroy{
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  isClickAction: boolean = true;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  private gridApi!: GridApi;
  rowData$!: Observable<any[]>;
  quickFilterValue = '';
  private selectServerConnect$ = new Subscription();
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefs: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52,
    },
    {
      headerName: '',
      field: 'id',
      suppressSizeToFit: true,
      width: 200,
      cellRenderer: ConnectionActionsRendererComponent,
      cellClass: 'connection-actions'
    },
    { field: 'name'},
    { field: 'category' },
    {
      headerName: 'Connection',
      field: 'parameters.status',
      cellRenderer: ConnectionStatusRendererComponent,
    },
    { 
      headerName: 'Server',
      field: 'parameters.server',
    }
  ];
  constructor(
    private serverConnectService: ServerConnectService,
    private store: Store,
    private toastr: ToastrService,
    private router: Router,
    iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private helpers: HelpersService
  ) { 
    this.selectServerConnect$ = this.store.select(selectServerConnect).subscribe((data: any) => {
      this.rowData$ = of(data);
    })
    iconRegistry.addSvgIcon('export_json', this._setPath('/assets/icons/export_json.svg'));
  }

  ngOnInit(): void {
    this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectServerConnect$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  clearParameters() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      this.serverConnectService.clearParameters(this.rowsSelectedId).subscribe({
        next:(rest) => {
          this.router.navigate([RouteSegments.CONNECTION_PROFILES]).then(() => {
            window.location.reload();
          });
        },
      })
    }
  }

  exportJson() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.serverConnectService.exportJson(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Connection-Export.json', file);
        this.toastr.success(`Exported connection as ${'json'.toUpperCase()} file successfully`);
      })
      this.gridApi.deselectAll();
    }
  }

  pingTest() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      this.serverConnectService.pingTest(this.rowsSelectedId).subscribe(response => {
        if (response) {
          if (response.status_msg == "success") {
            this.toastr.success(response.message);
          }else {
            this.toastr.error(response.message);
          }
          this.gridApi.deselectAll();
        }
      });
    }
  }

  loginCheck() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      this.serverConnectService.loginCheck(this.rowsSelectedId).subscribe(response => {
        if (response) {
          if (response.status_msg == "success") {
            this.toastr.success(response.message);
          }else {
            this.toastr.error(response.message);
          }
          this.gridApi.deselectAll();
        }
      });
    }
  }
  
  private _setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onQuickFilterInput(e: any) {
    this.gridApi.setQuickFilter(e.target.value);
  }
}
