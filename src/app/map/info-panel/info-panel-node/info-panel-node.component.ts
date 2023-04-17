import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { CMActionsService } from "../../context-menu/cm-actions/cm-actions.service";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";


@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent implements OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';

  selectMapSelection$ = new Subscription();
  tabName = 'node';
  gridOptions: GridOptions = {
    headerHeight: 48,
    defaultColDef: {
      sortable: true,
      resizable: true,
      singleClickEdit: true,
      filter: true
    },
    rowSelection: 'multiple',
    onRowDoubleClicked: this.onRowDoubleClicked.bind(this),
    suppressRowDeselection: true,
    suppressCellFocus: true,
    enableCellTextSelection: true,
    pagination: true,
    paginationPageSize: 25,
    suppressRowClickSelection: true,
    animateRows: true,
    rowData: [],
    columnDefs: [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 52,
      },
      {
        field: 'id',
        hide: true
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'category',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'role',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'device',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'template',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'hardware',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'folder',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'domain',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'interfaces',
        cellRenderer: (param: any) => param.value,
        autoHeight: true,
        minWidth: 120,
        flex: 1
      },
      {
        field: 'login_profile',
        headerName: 'Login Profile',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'configs',
        headerName: 'Configuration',
        cellRenderer: (params: any) => {
          if (params.value.length > 0) {
            let html_str = "<div style='text-align:left;'><ul>"
            for (let i in params.value) {
              let item_html = `<li style='text-align: left'>${params.value[i].name}</li>`;
              html_str += item_html;
            }
            html_str += "</ul></div>"
            return html_str;
          } else {
            return
          }
        },
        autoHeight: true,
        minWidth: 120,
        flex: 1
      },
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy
    }
    this.dialog.open(AddUpdateNodeDialogComponent,
      { hasBackdrop: false, width: '1000px', height: '900px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
    );
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    iconRegistry: MatIconRegistry,
    private nodeService: NodeService,
    private helpers: HelpersService,
    private cmActionsService: CMActionsService,
  ) {
    iconRegistry.addSvgIcon('export-csv', this.helpers.setIconPath('/assets/icons/export-csv-info-panel.svg'));
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json-info-panel.svg'));
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        const rowData = this.activeNodes.map((ele: any) => {
          if (ele.data('device')?.name) {
            ele.data('device', ele.data('device')?.name)
          }
          if (ele.data('template')?.name) {
            ele.data('template', ele.data('template')?.name)
          }
          if (ele.data('domain')?.name) {
            ele.data('domain', ele.data('domain')?.name)
          }
          if (ele.data('hardware')?.serial_number) {
            ele.data('hardware', ele.data('hardware')?.serial_number)
          }
          if (ele.data('login_profile')?.name) {
            ele.data('login_profile', ele.data('login_profile')?.name)
          }
          return ele.data();
        });
        const activeEleIds = this.activeNodes.map(ele => ele.data('id'));
        this.infoPanelTableComponent?.setSelectedEles(activeEleIds, rowData);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
  }

  cloneNodes() {
    if (this.infoPanelTableComponent?.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.infoPanelTableComponent?.rowsSelected.length === 1 ? 'Clone this node?' : 'Clone these nodes?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { hasBackdrop: false, width: '400px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent) {
          const ids = this.infoPanelTableComponent.rowsSelectedId;
          this.cmActionsService.cloneNodes(this.cy, ids);
        }
      })
    }
  }

  deleteNodes() {
    this.infoPanelTableComponent?.delete(this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs);
  }

  editNodes() {
    this.infoPanelTableComponent?.edit();
  }

  exportNodes(format: string) {
    if (this.infoPanelTableComponent?.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        pks: this.infoPanelTableComponent?.rowsSelectedId
      }
      const fileName = format === 'json' ? 'Node-Export.json' : 'node_export.csv';
      let file = new Blob();
      this.nodeService.export(format, jsonData).subscribe(response => {
        if (format === 'json') {
          file = new Blob([JSON.stringify(response, null, 4)], { type: 'application/json' });
        }
        this.helpers.downloadBlob(fileName, file);
        this.toastr.success(`Exported node as ${format.toUpperCase()} file successfully`);
      })
    }
  }

  validateNode() {
    this.infoPanelTableComponent?.validate();
  }

  clearTable() {
    this.infoPanelTableComponent?.clearTable();
  }
}
