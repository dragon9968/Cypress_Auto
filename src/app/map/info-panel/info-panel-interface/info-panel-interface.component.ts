import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { forkJoin, map } from "rxjs";

@Component({
  selector: 'app-info-panel-interface',
  templateUrl: './info-panel-interface.component.html',
  styleUrls: ['./info-panel-interface.component.scss']
})
export class InfoPanelInterfaceComponent implements OnInit, DoCheck {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  private gridApi!: GridApi;
  private activeEdgeOld?: string;
  rowsSelected: any[] = [];

  public gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    rowSelection: 'multiple',
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        suppressSizeToFit: true,
        width: 52,
      },
      {
        headerName: 'Actions',
        field: 'id',
        suppressSizeToFit: true,
        width: 160,
        cellRenderer: InfoPanelRenderComponent,
        cellClass: 'interface-actions',
        cellRendererParams: {
          tabName: 'edge',
          getExternalParams: () => this
        }
      },
      {
        field: 'order',
        suppressSizeToFit: true,
        minWidth: 80,
        width: 100,
        maxWidth: 120
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 200,
        width: 250,
        maxWidth: 270
      },
      {
        field: 'description',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'status',
        minWidth: 130,
        width: 150,
        maxWidth: 170
      },
      {
        field: 'category',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'mac_address',
        headerName: 'Mac Address',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'port_group',
        headerName: 'Port Group',
        minWidth: 100,
        width: 200,
        maxWidth: 250
      },
      {
        field: 'ip_allocation',
        headerName: 'IP Allocation',
        minWidth: 200,
        width: 250,
        maxWidth: 270
      },
      {
        field: 'ip',
        headerName: 'IP',
        minWidth: 200,
        width: 250,
        maxWidth: 270
      },
      {
        field: 'netmark',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      }
    ]
  };

  constructor(
    private interfaceService: InterfaceService
  ) {
  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    const data = this.activeEdges.map(ele => ele.data());
    const stringEdgeData = JSON.stringify(data);
    if (this.activeEdgeOld !== stringEdgeData) {
      this.activeEdgeOld = stringEdgeData;
      this._setEdgeInfoPanel(this.activeEdges);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  private _setEdgeInfoPanel(activeEdges: any[]) {
    if (this.activeEdges.length === 0) {
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activeEdges.map(ele => {
          return this.interfaceService.get(ele.data('id')).pipe(
            map(edgeData => {
              const result = edgeData.result;
              return {
                id: result.id,
                order: result.order,
                name: result.name,
                description: result.description,
                status: result.status,
                category: result.category,
                mac_address: result.mac_address,
                port_group: result.port_group.name,
                ip_allocation: result.ip_allocation,
                ip: result.ip,
                netmask: result.netmask.mask
              }
            })
          )
        })
      ).subscribe(rowData => {
        if (this.gridApi != null) {
          this.gridApi.setRowData(rowData);
        }
      })
    }
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
  }
}
