import { Store } from "@ngrx/store";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { MatIconRegistry } from "@angular/material/icon";
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Observable, of, Subject, Subscription } from "rxjs";
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, RowDoubleClickedEvent } from "ag-grid-community";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { UserTaskService } from "../../../core/services/user-task/user-task.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectUserTasks } from "../../../store/user-task/user-task.selectors";
import { retrievedUserTasks } from "../../../store/user-task/user-task.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ShowUserTaskDialogComponent } from "./show-user-task-dialog/show-user-task-dialog.component";

@Component({
  selector: 'app-info-panel-task',
  templateUrl: './info-panel-task.component.html',
  styleUrls: ['./info-panel-task.component.scss']
})
export class InfoPanelTaskComponent implements OnInit, OnDestroy {
  @Input() infoPanelheight = '300px';
  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;
  selectUserTasks$ = new Subscription();
  rowsSelected: any[] = [];
  rowsSelectedId: any[] = [];
  userTasks!: any[];
  rowData$!: Observable<any>;
  isClickAction = false;
  tabName = 'userTask';
  nodesIdRendered: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

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
        suppressAutoSize: true,
        width: 52
      },
      {
        field: 'id',
        hide: true
      },
      {
        headerName: 'Display Name',
        field: 'display_name',
        minWidth: 300,
        flex: 1
      },
      {
        headerName: 'User ID',
        field: 'appuser_id',
        minWidth: 70,
        flex: 1
      },
      {
        headerName: 'Task ID',
        field: 'task_id',
        flex: 1
      },
      {
        headerName: 'State',
        field: 'task_state',
        minWidth: 100,
        flex: 1
      },
      {
        headerName:'Start Time',
        field: 'start_time',
        cellRenderer: (startTime: any) => startTime.value ? startTime.value.replace('T', ' ') : null,
        minWidth: 200,
        flex: 1
      }
    ]
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private iconRegister: MatIconRegistry,
    private helperService: HelpersService,
    private userTaskService: UserTaskService,
    private infoPanelService: InfoPanelService
  ) {
    this.selectUserTasks$ = this.store.select(selectUserTasks).pipe(takeUntil(this.destroy$)).subscribe(userTasks => {
      if (userTasks) {
        this.userTasks = userTasks;
        if (this.gridApi) {
          this.gridApi.setRowData(userTasks);
        } else {
          this.rowData$ = of(userTasks);
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
    this.userTaskService.getAll().pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.store.dispatch(retrievedUserTasks({data: data.result}));
    })
    this.refreshTaskListByInterval()
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  delete() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const item = this.rowsSelectedId.length === 1 ? 'this' : 'these';
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

  rerun() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.rowsSelectedId.length === 1 ? 'Rerun this task?' : 'Rerun these tasks?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.rerunTask(this.rowsSelectedId);
        }
      });
    }
  }

  revoke() {
    if (this.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Revoke pending task?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          let taskPendingId: any[] = []
          this.rowsSelected.map(task => {
            if (task.task_state === 'PENDING') {
              taskPendingId.push(task.id);
            } else {
              this.toastr.warning(`Task ${task.display_name} has state ${task.task_state} and can not be revoked!
                                    <br /> Revoke only apply to the pending task`, 'Warning', { enableHtml: true});
            }
          })
          if (taskPendingId.length !== 0) {
            this.infoPanelService.revokeTask(taskPendingId);
          }
        }
      });
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sortData();
  }

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.userTaskService.get(row.data.id).subscribe(response => {
      const dialogData = {
        mode: 'postTask',
        genData: response.result
      };
      this.dialog.open(ShowUserTaskDialogComponent, {
        width: `${screen.width}px`,
        autoFocus: false,
        data: dialogData
      });
    })
  }

  selectedRows() {
    this.rowsSelected = this.gridApi.getSelectedRows();
    this.rowsSelectedId = this.rowsSelected.map(ele => ele.id);
  }

  sortData() {
    this.gridColumnApi.applyColumnState({
      state: [{colId: 'id', sort: 'desc'}],
      defaultState: {sort: null}
    })
  }

  refreshTask() {
    this.infoPanelService.refreshTask();
  }

  refreshTaskListByInterval() {
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.nodesIdRendered = this.getTaskRendered();
      if (this.nodesIdRendered.length > 0) {
        this.userTaskService.getTaskAutoRefresh({pks: this.nodesIdRendered}).subscribe(response => {
          const tasks = response.result;
          this.setNodeDataRefresh(tasks);
        })
      }
    })
  }

  setRowActive() {
    if (this.rowsSelectedId.length > 0 && this.gridApi) {
      this.gridApi.forEachNode(row => {
        if (this.rowsSelectedId.includes(row.data.id)) {
          row.setSelected(true);
        }
      })
    }
  }

  clearRowSelected() {
    this.rowsSelectedId = [];
    this.rowsSelected = [];
    this.gridApi.deselectAll();
  }

  getTaskRendered() {
    if (this.gridApi) {
      return this.gridApi.getRenderedNodes().map(rowNode => rowNode.data.id);
    } else {
      return [];
    }
  }

  setNodeDataRefresh(tasks: any) {
    tasks.map((taskNew: any) => {
      taskNew.start_time = taskNew.start_time ? taskNew.start_time.replace('T', ' ') : null;
      this.gridApi?.forEachNode(rowNode => {
        if (rowNode.data.id === taskNew.id) {
          rowNode.setData(taskNew);
        }
      })
    })
  }
}
