import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { forkJoin, map } from "rxjs";

@Component({
  selector: 'app-info-panel-port-group',
  templateUrl: './info-panel-port-group.component.html',
  styleUrls: ['./info-panel-port-group.component.scss']
})
export class InfoPanelPortGroupComponent implements OnInit, DoCheck {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  private gridApi!: GridApi;
  private activePGOld?: string;
  rowsSelected: any[] = [];

  constructor(
    private portGroupService: PortGroupService
  ) {
  }

  ngOnInit(): void {
  }

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
        cellClass: 'pg-actions',
        cellRendererParams: {
          tabName: 'portGroup',
          getExternalParams: () => this
        }
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 100,
        width: 300,
        maxWidth: 200
      },
      {
        field: 'category',
        suppressSizeToFit: true,
        minWidth: 100,
        width: 300,
        maxWidth: 200
      },
      {
        field: 'vlan',
        headerName: 'VLAN',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'subnet_allocation',
        headerName: 'Subnet Allocation',
        minWidth: 100,
        width: 300,
        maxWidth: 200
      },
      {
        field: 'subnet',
        minWidth: 100,
        width: 300,
        maxWidth: 200
      },
      {
        field: 'domain',
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'interfaces',
        minWidth: 300,
        width: 400,
        cellRenderer: (param: any) => param.value,
        cellClass: 'row-interface',
        autoHeight: true
      }
    ]
  };

  ngDoCheck(): void {
    const data = this.activePGs.map(ele => ele.data());
    const stringPGData = JSON.stringify(data);
    if (this.activePGOld !== stringPGData) {
      this.activePGOld = stringPGData;
      this._setPGInfoPanel(this.activePGs);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  private _setPGInfoPanel(activePGs: any[]) {
    if (activePGs.length === 0) {
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activePGs.map(ele => {
          return this.portGroupService.get(ele.data('pg_id')).pipe(
            map(pgData => {
                const result = pgData.result;
                return {
                  id: result.id,
                  name: result.name,
                  category: result.category,
                  vlan: result.vlan,
                  subnet_allocation: result.subnet_allocation,
                  subnet: result.subnet,
                  domain: result.domain.name,
                  interfaces: result.interfaces
                }
              }
            )
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
