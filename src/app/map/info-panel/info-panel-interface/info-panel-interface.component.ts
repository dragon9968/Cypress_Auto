import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription } from "rxjs";
import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { selectIsSelectedFlag, selectLogicalInterfaces, selectLogicalManagementInterfaces, selectSelectedLogicalInterfaces } from "../../../store/interface/interface.selectors";
import { selectSelectedLogicalNodes } from "src/app/store/node/node.selectors";
import { selectSelectedPortGroups } from "src/app/store/portgroup/portgroup.selectors";

@Component({
  selector: 'app-info-panel-interface',
  templateUrl: './info-panel-interface.component.html',
  styleUrls: ['./info-panel-interface.component.scss']
})
export class InfoPanelInterfaceComponent implements OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() infoPanelheight = '300px';
  filterOptionForm!: FormGroup;
  interfaces: any[] = [];
  managementInterfaces: any[] = [];
  selectedInterfaces: any[] = [];
  selectedNodes: any[] = [];
  selectedNodesId: any[] = [];
  selectedInterfacesByNodes: any[] = [];
  selectedIds: any[] = [];
  selectedInterfacesIdsByNodes: any[] = [];
  selectedInterfacesIdsByPG: any[] = [];
  selectedPGs: any[] = [];
  selectedPGsId: any[] = [];
  isSelectedFlag = false;
  filterOption = 'all';
  tabName = 'interface';
  selectLogicalInterfaces$ = new Subscription();
  selectLogicalManagementInterfaces$ = new Subscription();
  selectSelectedLogicalInterfaces$ = new Subscription();
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectIsSelectedFlag$ = new Subscription();
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
        field: 'order',
        minWidth: 80,
        flex: 1,
      },
      {
        field: 'name',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'description',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'status',
        minWidth: 130,
        flex: 1,
      },
      {
        field: 'category',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'node.name',
        headerName: 'Node',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'mac_address',
        headerName: 'Mac Address',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'port_group.name',
        headerName: 'Port Group',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'ip_allocation',
        headerName: 'IP Allocation',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'ip',
        headerName: 'IP',
        minWidth: 200,
        flex: 1,
      },
      {
        field: 'netmask.mask',
        headerName: 'Netmask',
        minWidth: 100,
        flex: 1,
      }
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    const dialogData = {
      mode: 'view',
      genData: row.data,
      cy: this.cy
    };
    this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
    private infoPanelService: InfoPanelService
  ) {
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectIsSelectedFlag$ = this.store.select(selectIsSelectedFlag).subscribe(isSelectedFlag => {
      this.isSelectedFlag = isSelectedFlag
    });
    this.selectLogicalInterfaces$ = this.store.select(selectLogicalInterfaces).subscribe(interfaces => {
      if (interfaces && !this.isSelectedFlag) {
        this.interfaces = interfaces;
        this.loadInterfacesTable();
      }
    });
    this.selectLogicalManagementInterfaces$ = this.store.select(selectLogicalManagementInterfaces).subscribe(managementInterfaces => {
      if (managementInterfaces) {
        this.managementInterfaces = managementInterfaces;
      }
    });
    this.selectSelectedLogicalInterfaces$ = this.store.select(selectSelectedLogicalInterfaces).subscribe(selectedInterfaces => {
      if (selectedInterfaces) {
        this.selectedInterfaces = selectedInterfaces;
        this.selectedIds = selectedInterfaces.map(i => i.id);
        this.infoPanelTableComponent?.deselectAll();
        if (this.filterOption == 'selected') {
          this.infoPanelTableComponent?.setRowData(this.selectedInterfaces);
        }
        this.infoPanelTableComponent?.setRowActive(this.selectedIds);
      }
    });
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodes = selectedNodes;
        this.selectedNodesId = this.selectedNodes.map((ele: any) => ele.id)
        const interfacesData = this.interfaces.filter((i: any) => this.selectedNodesId.includes(i.node_id))
        this.selectedInterfacesIdsByNodes = interfacesData.map(i => i.id);
        this.infoPanelTableComponent?.deselectAll();
        if (this.filterOption == 'selected_by_node') {
          this.infoPanelTableComponent?.setRowData(interfacesData);
          this.infoPanelTableComponent?.setRowActive(this.selectedInterfacesIdsByNodes);
        }
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGs = selectedPGs;
        this.selectedPGsId = selectedPGs.map(pg => pg.id);
        const interfacesData = this.interfaces.filter((i: any) => this.selectedPGsId.includes(i.port_group_id))
        this.selectedInterfacesIdsByPG = interfacesData.map(i => i.id);
        this.infoPanelTableComponent?.deselectAll();
        if (this.filterOption === 'selected_by_pg') {
          this.infoPanelTableComponent?.setRowData(interfacesData);
          this.infoPanelTableComponent?.setRowActive(this.selectedInterfacesIdsByPG);
        }
      }
    });
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('all')
    });
  }

  ngOnDestroy(): void {
    this.selectLogicalInterfaces$.unsubscribe();
    this.selectLogicalManagementInterfaces$.unsubscribe();
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectIsSelectedFlag$.unsubscribe();
  }

  private loadInterfacesTable() {
    if (this.filterOption == 'all') {
      this.infoPanelTableComponent?.setRowData(this.interfaces);
    } else if (this.filterOption == 'selected') {
      this.infoPanelTableComponent?.setRowData(this.selectedInterfaces);
    } else if (this.filterOption === 'management') {
      this.infoPanelTableComponent?.setRowData(this.managementInterfaces);
    } else if (this.filterOption === 'selected_by_node') {
      const interfacesData = this.interfaces.filter((i: any) => this.selectedNodesId.includes(i.node_id))
      this.infoPanelTableComponent?.setRowData(interfacesData);
    } else if (this.filterOption === 'selected_by_pg') {
      const interfacesData = this.interfaces.filter((i: any) => this.selectedPGsId.includes(i.port_group_id))
      this.infoPanelTableComponent?.setRowData(interfacesData);
    }

    this.infoPanelTableComponent?.deselectAll();
    this.infoPanelTableComponent?.setRowActive(this.selectedIds);
    this.infoPanelTableComponent?.setRowActive(this.selectedInterfacesIdsByNodes);
    this.infoPanelTableComponent?.setRowActive(this.selectedInterfacesIdsByPG);
  }

  deleteInterfaces() {
    this.infoPanelTableComponent?.delete();
  }

  editInterfaces() {
    this.infoPanelTableComponent?.edit();
  }

  randomizeIp() {
    const selectedRows = this.infoPanelTableComponent?.rowsSelectedIds
    if (selectedRows?.length == 0) {
      this.toastr.info('No row selected');
    } else {
      const message = selectedRows?.length == 1 ? 'Generate a new randomized IP for this interface?' : 'Generate a new randomized IP for these interfaces?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '500px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent) {
          this.infoPanelService.randomizeIpInterfaces(this.infoPanelTableComponent.rowsSelected);
        }
      });
    }
  }

  validateInterface() {
    this.infoPanelTableComponent?.validate();
  }

  changeFilterOption(menuTrigger: MatMenuTrigger, $event: any) {
    menuTrigger.closeMenu();
    this.filterOption = $event.value;
    this.loadInterfacesTable();
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
