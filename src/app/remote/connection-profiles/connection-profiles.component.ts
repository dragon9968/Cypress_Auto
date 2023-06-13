import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { MatIconRegistry } from "@angular/material/icon";
import { ColDef, GridApi, GridReadyEvent, RowDoubleClickedEvent } from 'ag-grid-community';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { selectServerConnects } from 'src/app/store/server-connect/server-connect.selectors';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ConnectionStatusRendererComponent } from '../renderers/connection-status/connection-status-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { AddEditConnectionProfilesComponent } from './add-edit-connection-profiles/add-edit-connection-profiles.component';
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { catchError } from "rxjs/operators";

@Component({
  selector: 'app-connection-profiles',
  templateUrl: './connection-profiles.component.html',
  styleUrls: ['./connection-profiles.component.scss']
})
export class ConnectionProfilesComponent implements OnInit, OnDestroy{
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  isClickAction: boolean = true;
  id: any;
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  private gridApi!: GridApi;
  rowData$!: Observable<any[]>;
  quickFilterValue = '';
  private selectServerConnect$ = new Subscription();
  serverConnection: any[] = [];
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
      field: 'id',
      hide: true
    },
    { field: 'name'},
    { field: 'category' },
    {
      headerName: 'Connection',
      field: 'status',
      cellRenderer: ConnectionStatusRendererComponent,
      sortable: false
    },
    {
      headerName: 'Server',
      field: 'server',
    },
    {
      headerName: 'User ID',
      field: 'username'
    },
    { field: 'version' },
    {
      headerName: "UUID",
      field: 'uuid'
    },
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
      this.serverConnection = data;
      if (this.gridApi) {
        this.gridApi.setRowData(data)
      } else {
        this.rowData$ = of(data);
      }
      this.updateRowConnectionProfile();
    })
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
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
    this.id = this.rowsSelectedId[0];
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
    } else {
      this.serverConnectService.pingTest(this.rowsSelectedId).pipe(
        catchError(error => {
          this.toastr.error('Ping test failed', 'Error');
          return throwError(() => error);
        })
      ).subscribe(response => {
        const pingTests = response.result;
        this.updateConnectionStatusInStorage('ping_test', pingTests, this.serverConnection);
      });
    }
  }

  loginCheck() {
    if (this.rowsSelectedId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      this.serverConnectService.loginCheck(this.rowsSelectedId).pipe(
        catchError(error => {
          this.toastr.error('Login Check failed', 'Error');
          return throwError(() => error);
        })
      ).subscribe(response => {
        const loginChecks = response.result;
        this.updateConnectionStatusInStorage('login_check', loginChecks, this.serverConnection);
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
          datastore_cluster: false,
          switch: '',
          switch_type: 'dvswitch',
          management_network: '',
          username: '',
          password: ''
        }
      }
    }
    this.dialog.open(AddEditConnectionProfilesComponent, {
      disableClose: true,
      autoFocus: false,
      width: '600px',
      data: dialogData
    });
  }

  onRowDoubleClick(row: RowDoubleClickedEvent) {
    this.serverConnectService.get(row.data.id).subscribe(data => {
      const dialogData = {
        mode: 'view',
        genData: data.result
      }
      this.dialog.open(AddEditConnectionProfilesComponent, {
        disableClose: true,
        autoFocus: false,
        width: '600px',
        data: dialogData
      });
    })
  }

  updateConnection() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.serverConnectService.get(this.id).subscribe(data => {
        const dialogData = {
          mode: 'update',
          genData: data.result
        }
        this.dialog.open(AddEditConnectionProfilesComponent, {
          disableClose: true,
          autoFocus: false,
          width: '600px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to connection profile.<br>Please select only one connection profile',
      'Info', { enableHtml: true });
    }
  }

  deleteConnection() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `You sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '450px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowsSelected.map(connection => {
            this.serverConnectService.delete(connection.id).pipe(
              catchError(error => {
                this.toastr.error('Delete connection profile failed', 'Error');
                return throwError(() => error);
              })
            ).subscribe(() =>{
              this.serverConnectService.getAll().subscribe(
                (data: any) => this.store.dispatch(retrievedServerConnect({data: data.result}))
              );
              this.toastr.success(`Deleted connection ${connection.name} successfully`, 'Success');
            });
          })
          this.clearRow();
        }
      });
    }
  }

  clearRow() {
    this.gridApi.deselectAll();
    this.rowsSelectedId = [];
    this.rowsSelected = [];
    this.id = undefined;
  }

  updateConnectionStatusInStorage(typeAction: string, newConnectionStatus: any[], currentConnections: any[]) {
    const newServerConnections = JSON.parse(JSON.stringify(currentConnections))
    newConnectionStatus.map((newConnection: any) => {
      const connection = newServerConnections.find((connection: any) => connection.id === newConnection.id)
      connection.status = newConnection.status
      newServerConnections.splice(newServerConnections.indexOf(connection), 1, connection)
      if (newConnection.status == 'Good') {
        if (typeAction == 'ping_test') {
          this.toastr.success(`${newConnection.msg}`, 'Success')
        } else {
          this.toastr.success(`Login Check for ${newConnection.name} successfully`, 'Success')
          if (newConnection.validate_vm_result) {
            if (newConnection.validate_vm_result?.is_valid) {
              this.toastr.success(newConnection.validate_vm_result.message, 'Success')
            } else {
              this.toastr.warning(newConnection.validate_vm_result.message, 'Warning')
            }
          }
        }
      } else {
        if (typeAction == 'ping_test') {
          this.toastr.success(`${newConnection.msg}`, 'Error')
        } else {
          this.toastr.error(`Login Check for ${newConnection.name} failed`, 'Error')
        }
      }
    })
    this.store.dispatch(retrievedServerConnect({data: newServerConnections}))
  }
}
