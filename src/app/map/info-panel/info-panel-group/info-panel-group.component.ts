import { Component, Input, OnInit } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent } from "ag-grid-community";
import { Observable, of, Subscription } from "rxjs";
import { InfoPanelRenderComponent } from "../info-panel-render/info-panel-render.component";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Params } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { GroupService } from "../../../core/services/group/group.service";
import { retrievedGroups } from "../../../store/group/group.actions";
import { selectGroups } from "../../../store/group/group.selectors";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";

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
  groups!: any[];

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
        cellClass: 'group-actions',
        cellRendererParams: {
          tabName: 'group',
          getExternalParams: () => this
        }
      },
      {
        field: 'name',
        suppressSizeToFit: true,
        minWidth: 100,
        flex: 1,
        maxWidth: 200,
      },
      {
        field: 'category',
        suppressSizeToFit: true,
        minWidth: 100,
        flex: 1,
        maxWidth: 200,
      },
      {
        field: 'nodes',
        suppressSizeToFit: true,
        minWidth: 300,
        flex: 1,
      },
      {
        field: 'port_groups',
        headerName: 'Port Groups',
        suppressSizeToFit: true,
        minWidth: 300,
        flex: 1,
      }
    ]
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private groupService: GroupService
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
        this.rowData$ = of(groupDataAg);
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
    this.dialog.open(AddUpdateGroupDialogComponent, { width: '600px', data: dialogData });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
  }
}
