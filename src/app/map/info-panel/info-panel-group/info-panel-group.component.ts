import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { GroupService } from "../../../core/services/group/group.service";
import { ProjectService } from "../../../project/services/project.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectGroups } from "../../../store/group/group.selectors";
import { retrievedGroups } from "../../../store/group/group.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { MatMenuTrigger } from "@angular/material/menu";
import { retrievedMapFilterOptionGroup } from "src/app/store/map-filter-option/map-filter-option.actions";
import { selectMapFilterOptionGroup } from "src/app/store/map-filter-option/map-filter-option.selectors";
import { retrievedMapSelection } from "src/app/store/map-selection/map-selection.actions";
import { selectMapSelection } from "src/app/store/map-selection/map-selection.selectors";
import { FormControl, FormGroup } from "@angular/forms";

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
  @Input() activeGBs: any[] = [];
  filterOptionForm!: FormGroup;
  mapCategory = '';
  projectId: string = '0';
  selectGroups$ = new Subscription();
  selectMapFilterOptionGroup$ = new Subscription();
  selectMapSelection$ = new Subscription();
  groups!: any[];
  tabName = 'group';
  groupDataAg: any[] = [];
  filterOption = 'all';
  rowData: any[] = [];
  activeEleIds: any[] = [];

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
        project_id: groupData.result.project_id,
        map_category: 'logical'
      };
      this.dialog.open(AddUpdateGroupDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
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
        this.groupDataAg = groupData.map(ele => {
          return {
            id: ele.id,
            name: ele.name,
            project_id: ele.project_id,
            description: ele.description,
            domain_id: ele.domain_id,
            domain: ele.domain?.name,
            category: ele.category,
            nodes: '[' + ele.nodes?.map((nodeData: any) => nodeData.name).join(', ') + ']',
            port_groups: '[' + ele.port_groups?.map((pgData: any) => pgData.name).join(', ') + ']',
            map_images: '[' + ele.map_images?.map((mapImageData: any) => mapImageData.name).join(', ') + ']',
          }
        });
        this.infoPanelTableComponent?.setRowData(this.groupDataAg);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedId);
      }
    })

    this.selectMapFilterOptionGroup$ = this.store.select(selectMapFilterOptionGroup).subscribe(mapFilterOption => {
      this.filterOption = mapFilterOption;
      if (mapFilterOption && mapFilterOption == 'all') {
        this.infoPanelTableComponent?.setRowData(this.groupDataAg);
        const activeEleGroupIds = this.activeGBs.map(ele => ele.data('group_id'));
        this.infoPanelTableComponent?.deselectAll();
        this.infoPanelTableComponent?.setRowActive(activeEleGroupIds)
      } else if (mapFilterOption && mapFilterOption == 'selected') {
        this.activeEleIds = this.activeGBs.map(ele => ele.data('group_id'));
        this.rowData = this.groupDataAg.filter(val => this.activeEleIds.includes(val.id))
        this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowData);
        this.infoPanelTableComponent?.setRowActive(this.activeEleIds)
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    })
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection && this.filterOption !== 'all') {
        this.activeEleIds = this.activeGBs.map(ele => ele.data('group_id'));
        this.rowData =  this.groupDataAg.filter(val => this.activeEleIds.includes(val.id))
        this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowData);
        this.store.dispatch(retrievedMapSelection({ data: false }));
      } else if (mapSelection && this.filterOption === 'all') {
        const activeEleGroupIds = this.activeGBs.map(ele => ele.data('group_id'));
        this.infoPanelTableComponent?.deselectAll();
        this.infoPanelTableComponent?.setRowActive(activeEleGroupIds)
      }
    });
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('')
    });
    this.filterOptionForm.get('filterOptionCtr')?.setValue('all');
  }

  ngOnInit(): void {
    this.mapCategory = 'logical';
    this.projectId = this.projectService.getProjectId();
    this.groupService.getGroupByProjectId(this.projectId).subscribe(
      groupData => this.store.dispatch(retrievedGroups({ data: groupData.result }))
    )
  }

  ngOnDestroy(): void {
    this.selectGroups$.unsubscribe();
    this.selectMapSelection$.unsubscribe();
  }

  addGroup() {
    const dialogData = {
      mode: 'add',
      genData: {},
      project_id: this.projectId,
      map_category: this.mapCategory
    };
    this.dialog.open(AddUpdateGroupDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
  }

  editGroup() {
    if (this.infoPanelTableComponent?.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.infoPanelTableComponent?.rowsSelectedId.length === 1) {
      this.groupService.get(this.infoPanelTableComponent?.rowsSelectedId[0]).subscribe(groupData => {
        const dialogData = {
          mode: 'update',
          genData: groupData.result,
          project_id: groupData.result.project_id,
          map_category: 'logical'
        };
        const dialogRef = this.dialog.open(AddUpdateGroupDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
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
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {disableClose: true, width: '450px', data: dialogData});
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

  changeFilterOption(menuTrigger: MatMenuTrigger, $event: any) {
    menuTrigger.closeMenu();
    if ($event.value == 'all') {
      this.infoPanelTableComponent?.setRowData(this.groupDataAg);
    } else {
      this.infoPanelTableComponent?.setSelectedEles(this.activeEleIds, this.rowData);
    }
    this.store.dispatch(retrievedMapFilterOptionGroup({ data: $event.value }));
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }
  
}
