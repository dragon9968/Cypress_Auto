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
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";
import { MatMenuTrigger } from "@angular/material/menu";
import { FormControl, FormGroup } from "@angular/forms";
import { deleteGroups } from "src/app/store/group/group.actions";

@Component({
  selector: 'app-info-panel-group',
  templateUrl: './info-panel-group.component.html',
  styleUrls: ['./info-panel-group.component.scss']
})
export class InfoPanelGroupComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;

  @Input() cy: any;
  @Input() infoPanelheight = '300px';
  filterOptionForm!: FormGroup;
  mapCategory = '';
  projectId: string = '0';
  selectGroups$ = new Subscription();
  groups!: any[];
  tabName = 'group';
  groupDataAg: any[] = [];
  filterOption = 'all';
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
    this.selectGroups$ = this.store.select(selectGroups).subscribe(groups => {
      if (groups) {
        this.groups = groups.map(ele => {
          return {
            ...ele,
            nodes: '[' + ele.nodes?.map((nodeData: any) => nodeData.name).join(', ') + ']',
            port_groups: '[' + ele.port_groups?.map((pgData: any) => pgData.name).join(', ') + ']',
            map_images: '[' + ele.map_images?.map((mapImageData: any) => mapImageData.name).join(', ') + ']',
          }
        });
        this.loadGroupsTable();
      }
    })
    this.filterOptionForm = new FormGroup({
      filterOptionCtr: new FormControl('all')
    });
  }

  ngOnInit(): void {
    this.mapCategory = 'logical';
    this.projectId = this.projectService.getProjectId();
  }

  ngOnDestroy(): void {
    this.selectGroups$.unsubscribe();
  }

  private loadGroupsTable() {
    const selectedEles = this.groups.filter(n => n.isSelected);
    const selectedEleIds = selectedEles.map(n => n.id);
    if (this.filterOption == 'all') {
      this.infoPanelTableComponent?.setRowData(this.groups);
      this.infoPanelTableComponent?.deselectAll();
      this.infoPanelTableComponent?.setRowActive(selectedEleIds);
    } else if (this.filterOption == 'selected') {
      this.infoPanelTableComponent?.setSelectedEles(selectedEleIds, selectedEles);
    }
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
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.infoPanelTableComponent?.rowsSelectedIds.length === 1) {
      this.groupService.get(this.infoPanelTableComponent?.rowsSelectedIds[0]).subscribe(groupData => {
        const dialogData = {
          mode: 'update',
          genData: groupData.result,
          project_id: groupData.result.project_id,
          map_category: 'logical'
        };
        this.dialog.open(AddUpdateGroupDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to the Group.<br>Please select only one Group',
        'Info', { enableHtml: true });
    }
  }

  deleteGroup() {
    if (this.infoPanelTableComponent?.rowsSelectedIds.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.infoPanelTableComponent?.rowsSelectedIds.length === 1 ? 'this' : 'these';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${item}?`,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '450px', data: dialogData });
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent && this.infoPanelTableComponent.rowsSelectedIds.length > 0) {
          this.store.dispatch(deleteGroups({ ids: this.infoPanelTableComponent.rowsSelectedIds }));
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
    this.filterOption = $event.value;
    this.loadGroupsTable();
  }

  selectOption($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
  }

}
