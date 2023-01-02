import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { MatIconRegistry } from "@angular/material/icon";
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, of, Subscription } from 'rxjs';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { selectServerConnects } from 'src/app/store/server-connect/server-connect.selectors';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConnectionActionsRendererComponent } from '../renderers/connection-actions/connection-actions-renderer.component';
import { ConnectionStatusRendererComponent } from '../renderers/connection-status/connection-status-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { AddEditConnectionProfilesComponent } from './add-edit-connection-profiles/add-edit-connection-profiles.component';

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
      cellClass: 'connection-actions',
      sortable: false
    },
    { field: 'name'},
    { field: 'category' },
    {
      headerName: 'Connection',
      field: 'parameters.status',
      cellRenderer: ConnectionStatusRendererComponent,
      sortable: false
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
    private helpers: HelpersService,
    private dialog: MatDialog,
  ) {
    this.selectServerConnect$ = this.store.select(selectServerConnects).subscribe((data: any) => {
      if (this.gridApi) {
        this.gridApi.setRowData(data)
      } else {
        this.rowData$ = of(data);
      }
      this.updateRowConnectionProfile();
    })
    iconRegistry.addSvgIcon('export_json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
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
    } else {
      this.serverConnectService.clearParameters(this.rowsSelectedId).subscribe({
        next: (rest) => {
          this.toastr.success('Cleared parameter(s) successfully', 'Success');
          this.serverConnectService.getAll().subscribe(
            (data: any) => this.store.dispatch(retrievedServerConnect({data: data.result}))
          );
        },
        error: err => {
          this.toastr.error('Clear parameter(s) failed', 'Error');
        }
      })
    }
  }

  exportJson() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.serverConnectService.exportJson(this.rowsSelectedId).subscribe(response => {
        file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
        this.helpers.downloadBlob('Connection-Export.json', file);
        this.toastr.success(`Exported connection as ${'json'.toUpperCase()} file successfully`);
      })
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
          } else {
            this.toastr.error(response.message);
          }
        }
      });
    }
  }

  loginCheck() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.serverConnectService.loginCheck(this.rowsSelectedId).subscribe(response => {
        if (response) {
          if (response.status_msg == "success") {
            this.toastr.success(response.message);
          } else {
            this.toastr.error(response.message);
          }
        }
      });
    }
  }

  onQuickFilterInput(e: any) {
    this.gridApi.setQuickFilter(e.target.value);
  }

  updateRowConnectionProfile() {
    if (this.rowsSelectedId.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  
  addConnection() {
    const dialogData = {
      mode: 'add',
      genData: {
        name: '',
        category: 'vmware_vcenter',
        parameters: {
          server: '',
          datacenter: '',
          cluster: '',
          datastore: '',
          switch: '',
          switch_type: 'vswitch',
          management_network: '',
          username: '',
          password: ''
        }
      }
    }
    const dialogRef = this.dialog.open(AddEditConnectionProfilesComponent, {
      autoFocus: false,
      width: '600px',
      data: dialogData
    });
  }
}
