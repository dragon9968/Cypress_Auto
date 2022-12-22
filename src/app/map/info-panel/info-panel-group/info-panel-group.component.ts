import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Params } from "@angular/router";
import { Component, Input, OnInit } from '@angular/core';
import { Observable, of, Subscription } from "rxjs";
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { GroupService } from "../../../core/services/group/group.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { retrievedGroups } from "../../../store/group/group.actions";
import { selectGroups } from "../../../store/group/group.selectors";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-info-panel-group',
  templateUrl: './info-panel-group.component.html',
  styleUrls: ['./info-panel-group.component.scss']
})
export class InfoPanelGroupComponent implements OnInit {
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  mapCategory = '';
  collectionId: string = '0';
  selectGroups$ = new Subscription();
  rowData$!: Observable<any[]>;
  rowsSelected!: any[];
  rowsSelectedId: any[] = [];
  groups!: any[];
  tabName = 'group';

  public gridOptions: GridOptions = {
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
      },
      {
        field: 'category',
        minWidth: 100,
        flex: 1,
      },
      {
        field: 'nodes',
        minWidth: 300,
        flex: 1,
      },
      {
        field: 'port_groups',
        headerName: 'Port Groups',
        minWidth: 300,
        flex: 1,
      }
    ]
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private groupService: GroupService,
    private infoPanelService: InfoPanelService
  ) {
    this.selectGroups$ = this.store.select(selectGroups).subscribe(groupData => {
      if (groupData) {
        const groupDataAg = groupData.map(ele => {
          return {
            id: ele.id,
            name: ele.name,
            collection_id: ele.collection_id,
            description: ele.description,
            domain_id: ele.domain_id,
            domain: ele.domain?.name,
            category: ele.category,
            nodes: '[' + ele.nodes?.map((nodeData: any) => nodeData.name).join(', ') + ']',
            port_groups: '[' + ele.port_groups?.map((pgData: any) => pgData.name).join(', ') + ']'
          }
        })
        if (this.gridApi) {
          this.gridApi.setRowData(groupDataAg);
        } else {
          this.rowData$ = of(groupDataAg);
        }
        this.setRowActive();
      }
    })
  }

  get gridHeight() {
    const infoPanelHeightNumber = +(this.infoPanelheight.replace('px', ''));
    return infoPanelHeightNumber >= 300 ? (infoPanelHeightNumber-100) + 'px' : '200px';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.mapCategory = params['category'];
      this.collectionId = params['collection_id'];
    }
    )
    this.selectGroups$ = this.groupService.getGroupByCollectionId(this.collectionId).subscribe(
      groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
    )
  }

  addGroup() {
    const dialogData = {
      mode: 'add',
      genData: {},
      collection_id: this.collectionId,
      map_category: this.mapCategory
    };
    this.dialog.open(AddUpdateGroupDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.infoPanelService.viewInfoPanel(this.tabName, row.data.id);
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  editGroup() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedId.length === 1) {
      this.infoPanelService.openEditInfoPanelForm(undefined, this.tabName, this.rowsSelectedId[0], []);
    } else {
      this.toastr.info('Bulk edits do not apply to the Group.<br>Please select only one Group',
                          'Info', {enableHtml: true});
    }
  }

  deleteGroup() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedId.length === 1 ? 'this' : 'those';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.deleteInfoPanelNotAssociateMap(this.tabName, this.rowsSelectedId);
          this.clearRowSelected();
        }
      })

    }
  }

  setRowActive() {
    if (this.rowsSelectedId.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(rowNode => {
        if (this.rowsSelectedId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  clearRowSelected() {
    this.rowsSelected = [];
    this.rowsSelectedId = [];
    this.gridApi.deselectAll();
  }
}
