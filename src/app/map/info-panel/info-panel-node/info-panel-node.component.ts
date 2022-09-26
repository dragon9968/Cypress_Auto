import { Component, DoCheck, Input } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { forkJoin, map } from "rxjs";
import { NodeService } from "../../../core/services/node/node.service";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";

@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent implements DoCheck {

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  private gridApi!: GridApi;
  private activeNodeOld?: string;
  rowsSelected: any[] = [];

  private _setNodeInfoPanel(activeNodes: any[]) {
    if (activeNodes.length === 0) {
      if (this.gridApi != null) {
        this.gridApi.setRowData([]);
      }
    } else {
      forkJoin(
        activeNodes.map((ele: any) => {
          return this.nodeService.get(ele.data('node_id')).pipe(
            map(nodeData => {
              const result = nodeData.result;
              return {
                id: result.id,
                name: result.name,
                category: result.category,
                role: result.role,
                device: result.device.name,
                template: result.template.display_name,
                hardware: result.hardware?.serial_number,
                folder: result.folder,
                domain: result.domain.name,
                interfaces: result.interfaces,
                configuration_show: result.configuration_show,
                login_profile_show: result.login_profile_show,
              };
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
        cellClass: 'node-actions',
        cellRendererParams: {
          tabName: 'node',
          getExternalParams: () => this
        }
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 100,
        width: 150,
        maxWidth: 200
      },
      {
        field: 'category',
        minWidth: 80,
        width: 100,
        maxWidth: 120
      },
      {
        field: 'role',
        minWidth: 80,
        width: 100,
        maxWidth: 120
      },
      {
        field: 'device',
        minWidth: 80,
        width: 100,
        maxWidth: 120
      },
      {
        field: 'template',
        minWidth: 90,
        width: 110,
        maxWidth: 120,
      },
      {
        field: 'hardware',
        minWidth: 90,
        width: 110,
        maxWidth: 120,
      },
      {
        field: 'folder',
        minWidth: 60,
        width: 80,
        maxWidth: 100,
      },
      {
        field: 'domain',
        minWidth: 80,
        width: 100,
        maxWidth: 120,
      },
      {
        field: 'interfaces',
        minWidth: 160,
        width: 180,
        cellRenderer: (param: any) => param.value,
        cellClass: 'row-interface',
        autoHeight: true
      },
      {
        field: 'login_profile_show',
        headerName: 'Login Profile',
        minWidth: 100,
        width: 120,
        maxWidth: 140,
      },
      {
        field: 'configuration_show',
        headerName: 'Configuration',
        minWidth: 140,
        width: 180,
        maxWidth: 200,
        cellRenderer: (param: any) => param.value
      },
    ]
  };

  constructor(private nodeService: NodeService) {
  }

  ngDoCheck(): void {
    const data = this.activeNodes.map(ele=> ele.data());
    const stringNodeData = JSON.stringify(data);
    if (this.activeNodeOld !== stringNodeData) {
      this.activeNodeOld = stringNodeData;
      this._setNodeInfoPanel(this.activeNodes);
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
  }
}
