import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { Observable, of, Subscription } from "rxjs";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { GroupService } from "../../../core/services/group/group.service";
import { ProjectService } from "../../../project/services/project.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectGroups } from "../../../store/group/group.selectors";
import { retrievedGroups } from "../../../store/group/group.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";

@Component({
  selector: 'app-info-panel-group',
  templateUrl: './info-panel-group.component.html',
  styleUrls: ['./info-panel-group.component.scss']
})
export class InfoPanelGroupComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() infoPanelheight = '300px';
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  mapCategory = '';
  collectionId: string = '0';
  selectGroups$ = new Subscription();
  groups!: any[];
  tabName = 'group';

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
      },
      {
        field: 'map_images',
        headerName: 'Map Images',
        minWidth: 300,
        flex: 1,
      },
    ]
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.groupService.get(row.data.id).subscribe(groupData => {
      const dialogData = {
        mode: 'view',
        genData: groupData.result,
        collection_id: groupData.result.collection_id,
        map_category: 'logical'
      };
      this.dialog.open(AddUpdateGroupDialogComponent, { hasBackdrop: false, width: '600px', autoFocus: false, data: dialogData });
    })
    
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private groupService: GroupService,
    private projectService: ProjectService,
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
            port_groups: '[' + ele.port_groups?.map((pgData: any) => pgData.name).join(', ') + ']',
            map_images: '[' + ele.map_images?.map((mapImageData: any) => mapImageData.name).join(', ') + ']',
          }
        });
        this.infoPanelTableComponent?.setRowData(groupDataAg);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedId);
      }
    })
  }

  ngOnInit(): void {
    this.mapCategory = 'logical';
    this.collectionId = this.projectService.getCollectionId();
    this.groupService.getGroupByCollectionId(this.collectionId).subscribe(
      groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
    )
  }

  ngOnDestroy(): void {
    this.selectGroups$.unsubscribe();
  }

  addGroup() {
    const dialogData = {
      mode: 'add',
      genData: {},
      collection_id: this.collectionId,
      map_category: this.mapCategory
    };
    this.dialog.open(AddUpdateGroupDialogComponent, { hasBackdrop: false, width: '600px', autoFocus: false, data: dialogData });
  }

  editGroup() {
    if (this.infoPanelTableComponent?.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.infoPanelTableComponent?.rowsSelectedId.length === 1) {
      this.groupService.get(this.infoPanelTableComponent?.rowsSelectedId[0]).subscribe(groupData => {
        const dialogData = {
          mode: 'update',
          genData: groupData.result,
          collection_id: groupData.result.collection_id,
          map_category: 'logical'
        };
        const dialogRef = this.dialog.open(AddUpdateGroupDialogComponent, { hasBackdrop: false, width: '600px', autoFocus: false, data: dialogData });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.activePGs.splice(0);
            this.activeEdges.splice(0);
            this.activeNodes.splice(0);
          }
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to the Group.<br>Please select only one Group',
                          'Info', {enableHtml: true});
    }
  }

  deleteGroup() {
    if (this.infoPanelTableComponent?.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.infoPanelTableComponent?.rowsSelectedId.length === 1 ? 'this' : 'these';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {hasBackdrop: false, width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.deleteInfoPanelNotAssociateMap(this.tabName, this.infoPanelTableComponent?.rowsSelectedId);
          this.clearRowSelected();
        }
      })

    }
  }


  clearRowSelected() {
    this.infoPanelTableComponent?.deselectAll();
  }
}
