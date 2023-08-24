import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { CMActionsService } from "../../context-menu/cm-actions/cm-actions.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { MatMenuTrigger } from "@angular/material/menu";
import { selectIsSelectedFlag, selectLogicalNodes, selectPhysicalNodes, selectSelectedLogicalNodes, selectSelectedPhysicalNodes } from "src/app/store/node/node.selectors";
import { FormControl, FormGroup } from "@angular/forms";
import { selectMapCategory } from "src/app/store/map-category/map-category.selectors";
import { LocalStorageKeys } from "src/app/core/storage/local-storage/local-storage-keys.enum";


@Component({
  selector: 'app-info-panel-node',
  templateUrl: './info-panel-node.component.html',
  styleUrls: ['./info-panel-node.component.scss']
})
export class InfoPanelNodeComponent implements OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() infoPanelheight = '300px';
  nodes!: any[];
  logicalNodes!: any[];
  physicalNodes!: any[];
  selectedNodes: any[] = [];
  selectedIds: any[] = [];
  isSelectedFlag = false;
  filterOption = 'all';
  mapCategory: any;
  filterOptionForm!: FormGroup;
  selectLogicalNodes$ = new Subscription();
  selectSelectedLogicalNodes$ = new Subscription();
  selectIsSelectedFlag$ = new Subscription();
  selectPhysicalNodes$ = new Subscription();
  selectMapCategory$ = new Subscription();
  selectSelectedPhysicalNodes$ = new Subscription();
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
        flex: 1,
        sort: 'asc',
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
        field: 'device.name',
        headerName: 'Device',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'template.name',
        headerName: 'Template',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'hardware.serial_number',
        headerName: 'Hardware',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'folder',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'domain.name',
        headerName: 'Domain',
        minWidth: 100,
        flex: 1
      },
      {
        field: 'interfaces',
        cellRenderer: (param: any) => {
          let html_str = "<ul>";
          const interfaces = param.value?.filter((i: any) => !i.isDeleted) || [];
          interfaces.forEach((i: any) => {
            const item_html = `<li>${i.value}</li>`
            html_str += item_html
          });
          html_str += "</ul>"
          return html_str != '<ul></ul>' ? html_str : '';
        },
        autoHeight: true,
        minWidth: 120,
        flex: 1
      },
      {
        field: 'login_profile.name',
        headerName: 'Login Profile',
        minWidth: 120,
        flex: 1
      },
      {
        field: 'configs',
        headerName: 'Configuration',
        cellRenderer: (params: any) => {
          if (params?.value?.length > 0) {
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
      { disableClose: true, width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
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
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
    this.selectMapCategory$ = this.store.select(selectMapCategory).subscribe((mapCategory: any) => {
      this.mapCategory = mapCategory ? mapCategory : localStorage.getItem(LocalStorageKeys.MAP_STATE)
    })
    this.selectIsSelectedFlag$ = this.store.select(selectIsSelectedFlag).subscribe(isSelectedFlag => {
      this.isSelectedFlag = isSelectedFlag
    });
    this.selectLogicalNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => {
      if (nodes && !this.isSelectedFlag) {
        this.logicalNodes = nodes;
        this.loadNodesTable();
      }
    });
    this.selectPhysicalNodes$ = this.store.select(selectPhysicalNodes).subscribe(nodes => {
      if (nodes && !this.isSelectedFlag) {
        this.physicalNodes = nodes;
        this.loadNodesTable();
      }
    });
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedLogicalNodes => {
      if (selectedLogicalNodes && this.mapCategory === 'logical') {
        this.loadSelectedNodesTable(selectedLogicalNodes);
      }
    });
    this.selectSelectedPhysicalNodes$ = this.store.select(selectSelectedPhysicalNodes).subscribe(selectedPhysicalNodes => {
      if (selectedPhysicalNodes && this.mapCategory === 'physical') {
        this.loadSelectedNodesTable(selectedPhysicalNodes);
      }
    });
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('all')
    });
  }

  ngOnDestroy(): void {
    this.selectLogicalNodes$.unsubscribe();
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectIsSelectedFlag$.unsubscribe();
    this.selectPhysicalNodes$.unsubscribe();
    this.selectMapCategory$.unsubscribe();
    this.selectSelectedPhysicalNodes$.unsubscribe();
  }

  private loadNodesTable() {
    this.nodes = this.mapCategory === 'logical' ? this.logicalNodes : this.physicalNodes;
    if (this.filterOption == 'all') {
      this.infoPanelTableComponent?.setRowData(this.nodes);
    } else if (this.filterOption == 'selected') {
      this.infoPanelTableComponent?.setRowData(this.selectedNodes);
    }
    this.infoPanelTableComponent?.deselectAll();
    this.infoPanelTableComponent?.setRowActive(this.selectedIds);
  }

  private loadSelectedNodesTable(nodesData: any) {
    this.selectedNodes = nodesData;
    this.selectedIds = nodesData.map((n: any) => n.id);
    this.infoPanelTableComponent?.deselectAll();
    if (this.filterOption === 'selected') {
      this.infoPanelTableComponent?.setRowData(this.selectedNodes);
    }
    this.infoPanelTableComponent?.setRowActive(this.selectedIds);
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
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent) {
          const ids = this.infoPanelTableComponent.rowsSelectedIds;
          this.cmActionsService.cloneNodes(ids);
        }
      })
    }
  }

  deleteNodes() {
    this.infoPanelTableComponent?.delete();
  }

  editNodes() {
    this.infoPanelTableComponent?.edit();
  }

  exportNodes(format: string) {
    if (this.infoPanelTableComponent?.rowsSelected.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const jsonData = {
        pks: this.infoPanelTableComponent?.rowsSelectedIds
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

  changeFilterOption(menuTrigger: MatMenuTrigger, $event: any) {
    menuTrigger.closeMenu();
    this.filterOption = $event.value;
    this.loadNodesTable();
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
