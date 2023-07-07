import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Subscription } from "rxjs";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { FormControl, FormGroup } from "@angular/forms";
import { MatMenuTrigger } from "@angular/material/menu";
import { retrievedMapFilterOptionInterfaces } from "src/app/store/map-filter-option/map-filter-option.actions";
import { selectMapFilterOptionInterfaces } from "src/app/store/map-filter-option/map-filter-option.selectors";
import { selectInterfacesByProjectIdAndCategory } from "../../../store/interface/interface.selectors";

@Component({
  selector: 'app-info-panel-interface',
  templateUrl: './info-panel-interface.component.html',
  styleUrls: ['./info-panel-interface.component.scss']
})
export class InfoPanelInterfaceComponent implements OnDestroy, OnInit {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() infoPanelheight = '300px';
  filterOptionForm!: FormGroup;
  interfaces: any[] = [];
  rowDataInterfaces: any[] = [];
  activeEleIds: any[] = [];
  filterOption = 'all';
  // mapSelection!: any;

  tabName = 'edge';
  selectMapSelection$ = new Subscription();
  selectInterfaces$ = new Subscription();
  selectMapFilterOptionInterfaces$ = new Subscription();
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
        field: 'node',
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
        field: 'port_group',
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
        field: 'netmask',
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
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('all')
    });
    this.iconRegistry.addSvgIcon('randomize-subnet', this.helpers.setIconPath('/assets/icons/randomize-subnet.svg'));
    this.selectInterfaces$ = this.store.select(selectInterfacesByProjectIdAndCategory).subscribe(interfaces => {
      if (interfaces) {
        this.interfaces = interfaces?.map((ele: any) => ele.data);
        this.infoPanelTableComponent?.setRowData(this.interfaces);

      }
    })

    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        if (this.filterOptionCtr?.value == 'selected') {
          this.rowDataInterfaces = this.activeEdges.map(ele => ele.data())
          this.activeEleIds = this.activeEdges.map(ele => ele.data('id'));
          this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowDataInterfaces);
          this.store.dispatch(retrievedMapSelection({ data: false }));
        } else if (this.filterOptionCtr?.value === 'management') {
          if (this.interfaces) {
            const interfacesManagement = this.interfaces.filter(edge => edge.category === 'management')
            this.infoPanelTableComponent?.setRowData(interfacesManagement);
          }
          this.store.dispatch(retrievedMapSelection({ data: false }));
        } else {
          if (this.interfaces) {
            const activeEleInterfaceIds = this.activeEdges.map(ele => ele.data('interface_pk'));
            this.infoPanelTableComponent?.setRowData(this.interfaces);
            this.infoPanelTableComponent?.deselectAll();
            this.infoPanelTableComponent?.setRowActive(activeEleInterfaceIds)
          }
          this.store.dispatch(retrievedMapSelection({ data: false }));
        }
      }
    });

    this.selectMapFilterOptionInterfaces$ = this.store.select(selectMapFilterOptionInterfaces).subscribe(mapFilterOption => {
      if (mapFilterOption) {
        this.filterOptionCtr?.setValue(mapFilterOption);
        if (mapFilterOption == 'selected') {
          this.rowDataInterfaces = this.activeEdges.map(ele => ele.data());
          this.activeEleIds = this.activeEdges.map(ele => ele.data('id'));
          this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowDataInterfaces);
        } else if (this.filterOptionCtr?.value === 'management') {
          if (this.interfaces) {
            const interfacesManagement = this.interfaces.filter(edge => edge.category === 'management')
            this.infoPanelTableComponent?.setRowData(interfacesManagement);
          }
        } else {
          const activeEleInterfaceIds = this.activeEdges.map(ele => ele.data('interface_pk'));
          this.infoPanelTableComponent?.setRowData(this.interfaces);
          this.infoPanelTableComponent?.deselectAll();
          this.infoPanelTableComponent?.setRowActive(activeEleInterfaceIds)
        }
      }
    })
  }

  get filterOptionCtr() { return this.filterOptionForm.get('filterOptionCtr') }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber - 100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.store.dispatch(retrievedMapFilterOptionInterfaces({ data: 'all' }));
  }

  ngOnDestroy(): void {
    this.selectMapSelection$.unsubscribe();
    this.selectMapFilterOptionInterfaces$.unsubscribe();
    this.selectInterfaces$.unsubscribe();
  }

  deleteInterfaces() {
    this.infoPanelTableComponent?.delete(this.activeNodes, this.activePGs, this.activeEdges, this.activeGBs);
  }

  editInterfaces() {
    this.infoPanelTableComponent?.edit();
  }

  randomizeIp() {
    const selectedRows = this.infoPanelTableComponent?.rowsSelectedId
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

  clearTable() {
    this.infoPanelTableComponent?.clearTable();
  }


  changeFilterOption(menuTrigger: MatMenuTrigger, $event: any) {
    menuTrigger.closeMenu();
    if ($event.value == 'all') {
      this.infoPanelTableComponent?.setRowData(this.interfaces);
    } else if ($event.value == 'management') {
      const interfacesManagement = this.interfaces.filter(edge => edge.category === 'management')
      this.infoPanelTableComponent?.setRowData(interfacesManagement);
    } else {
      this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowDataInterfaces);
    }
    this.store.dispatch(retrievedMapFilterOptionInterfaces({ data: $event.value }));
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
