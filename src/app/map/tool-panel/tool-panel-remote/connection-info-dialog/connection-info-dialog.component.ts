import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { Observable, of, throwError } from "rxjs";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-connection-info-dialog',
  templateUrl: './connection-info-dialog.component.html',
  styleUrls: ['./connection-info-dialog.component.scss']
})
export class ConnectionInfoDialogComponent implements OnInit {
  connectionInfoForm!: FormGroup;
  private gridApiHost!: GridApi;
  private gridApiDistributedSwitches!: GridApi;
  private gridApiStandardSwitches!: GridApi;
  rowDataHosts$!: Observable<any[]>;
  rowDataDistributedSwitches$!: Observable<any[]>;
  rowDataStandardSwitches$!: Observable<any[]>;

  gridHostOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    suppressCellFocus: true,
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'cpu',
        headerName: 'CPU',
        minWidth: 140,
        cellRenderer: (cpuInfos: any) => {
          let cpusHtml = '<ul>'
          cpuInfos.value?.map((cpuInfo: any) => {
            cpusHtml += `<li>${cpuInfo}</li>`
          });
          cpusHtml += '</ul>'
          return cpusHtml != '<ul></ul>' ? cpusHtml : '';
        },
        autoHeight: true,
        cellClass: 'cell-ul',
        flex: 1,
      },
      {
        field: 'memory_size',
        headerName: 'Memory Size',
        minWidth: 140,
        flex: 1,
      },
      {
        field: 'model',
        minWidth: 160,
        flex: 1,
      },
      {
        field: 'vendor',
        minWidth: 140,
        flex: 1,
      },
      {
        field: 'uuid',
        headerName: 'UUID',
        minWidth: 140,
        flex: 1,
      }
    ]
  };

  gridDistributedOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        field: 'name',
        headerName: 'Name',
        minWidth: 120,
        flex: 1,
      },
      {
        field: 'vlanID',
        headerName: 'VLAN',
        minWidth: 140,
        flex: 1,
      },
      {
        field: 'uplinks',
        cellRenderer: (uplinks: any) => {
          let uplinksHtml = '<ul>'
          uplinks.value?.map((uplink: any) => {
            uplinksHtml += `<li>${uplink}</li>`
          });
          uplinksHtml += '</ul>'
          return uplinksHtml != '<ul></ul>' ? uplinksHtml : '';
        },
        cellClass: 'cell-ul',
        flex: 1,
      }
    ]
  };

  gridStandardOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        field: 'host',
        minWidth: 150,
        flex: 1,
      },
      {
        field: 'switches',
        cellRenderer: (switches: any) => {
          let switchesHtml = '<ul>'
          switches.value?.map((sw: any) => {
            switchesHtml += `<li>${sw.name}</li>`
          })
          switchesHtml += '</ul>'
          return switchesHtml != '<ul></ul>' ? switchesHtml : '';
        },
        cellClass: 'cell-ul',
        minWidth: 150,
        flex: 1,
      }
    ]
  };

  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serverConnectionService: ServerConnectService
  ) {
    this.connectionInfoForm = new FormGroup({
      nameCtr: new FormControl(''),
      categoryCtr: new FormControl(''),
      serverCtr: new FormControl(''),
      datacenterCtr: new FormControl(''),
      clusterCtr: new FormControl(''),
      datastoreCtr: new FormControl(''),
      switchCtr: new FormControl(''),
      userCtr: new FormControl(''),
    })
    this.serverConnectionService.getConnectionInfo({pk: this.data.id}).pipe(
      catchError(err => {
        this.toastr.error('Get connection info failed!', 'Error')
        return throwError(() => err)
      })
    ).subscribe(response => {
      const data = response.result;
      const message = response.message;
      this.rowDataHosts$ = of(data.hosts)
      this.rowDataDistributedSwitches$ = of(data.distributed_sw)
      this.rowDataStandardSwitches$ = of(data.standard_sw)
      if (message.includes('invalid')) {
        let messageList = message.split(', ')
        const messageListUni = [...new Set(messageList)]
        messageListUni.map((mess: any) => this.toastr.warning(mess, 'Waring'))
      }
    })
  }

  get nameCtr() { return this.connectionInfoForm.get('nameCtr') }
  get categoryCtr() { return this.connectionInfoForm.get('categoryCtr') }
  get serverCtr() { return this.connectionInfoForm.get('serverCtr') }
  get datacenterCtr() { return this.connectionInfoForm.get('datacenterCtr') }
  get clusterCtr() { return this.connectionInfoForm.get('clusterCtr') }
  get datastoreCtr() { return this.connectionInfoForm.get('datastoreCtr') }
  get switchCtr() { return this.connectionInfoForm.get('switchCtr') }
  get userCtr() { return this.connectionInfoForm.get('userCtr') }

  onGridReady(params: GridReadyEvent) {
    this.gridApiHost = params.api;
  }

  onGridDistributedReady(params: GridReadyEvent) {
    this.gridApiDistributedSwitches = params.api;
  }

  onGridStandardReady(params: GridReadyEvent) {
    this.gridApiStandardSwitches = params.api;
  }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.name)
    this.categoryCtr?.setValue(this.data.category)
    this.serverCtr?.setValue(this.data.server)
    this.datacenterCtr?.setValue(this.data.datacenter)
    this.clusterCtr?.setValue(this.data.cluster)
    this.datastoreCtr?.setValue(this.data.datastore)
    this.switchCtr?.setValue(this.data.switch)
    this.userCtr?.setValue(this.data.username)
  }

}
