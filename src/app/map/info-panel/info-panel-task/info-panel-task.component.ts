import { Store } from "@ngrx/store";
import { takeUntil } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { interval, Subject, Subscription } from "rxjs";
import { GridOptions, RowDoubleClickedEvent } from "ag-grid-community";
import { UserTaskService } from "../../../core/services/user-task/user-task.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { selectUserTasks } from "../../../store/user-task/user-task.selectors";
import { retrievedUserTasks } from "../../../store/user-task/user-task.actions";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { ShowUserTaskDialogComponent } from "./show-user-task-dialog/show-user-task-dialog.component";
import { InfoPanelTableComponent } from "src/app/shared/components/info-panel-table/info-panel-table.component";

@Component({
  selector: 'app-info-panel-task',
  templateUrl: './info-panel-task.component.html',
  styleUrls: ['./info-panel-task.component.scss']
})
export class InfoPanelTaskComponent implements OnInit, OnDestroy {
  @ViewChild(InfoPanelTableComponent) infoPanelTableComponent: InfoPanelTableComponent | undefined;
  
  @Input() infoPanelheight = '300px';
  selectUserTasks$ = new Subscription();
  userTasks!: any[];
  tabName = 'userTask';
  nodesIdRendered: any[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>()
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
  };

  onRowDoubleClicked(row: RowDoubleClickedEvent) {
    this.userTaskService.get(row.data.id).subscribe(response => {
      const dialogData = {
        mode: 'postTask',
        genData: response.result
      };
      this.dialog.open(ShowUserTaskDialogComponent, {
        hasBackdrop: false,
        width: `${screen.width}px`,
        autoFocus: false,
        data: dialogData
      });
    })
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userTaskService: UserTaskService,
    private infoPanelService: InfoPanelService
  ) {
    this.selectUserTasks$ = this.store.select(selectUserTasks).pipe(takeUntil(this.destroy$)).subscribe(userTasks => {
      if (userTasks) {
        this.userTasks = userTasks;
        this.infoPanelTableComponent?.setRowData(userTasks);
        this.infoPanelTableComponent?.setRowActive(this.infoPanelTableComponent?.rowsSelectedId);
      }
    })
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
        if (confirm && this.infoPanelTableComponent) {
          this.infoPanelService.deleteInfoPanelNotAssociateMap(this.tabName, this.infoPanelTableComponent.rowsSelectedId);
          this.clearRowSelected();
        }
      })
    }
  }

  rerun() {
    if (this.infoPanelTableComponent?.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const message = this.infoPanelTableComponent?.rowsSelectedId.length === 1 ? 'Rerun this task?' : 'Rerun these tasks?';
      const dialogData = {
        title: 'User confirmation needed',
        message: message,
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {hasBackdrop: false, width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm && this.infoPanelTableComponent) {
          this.infoPanelService.rerunTask(this.infoPanelTableComponent.rowsSelectedId);
        }
      });
    }
  }

  revoke() {
    if (this.infoPanelTableComponent?.rowsSelectedId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Revoke pending task?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {hasBackdrop: false, width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          let taskPendingId: any[] = []
          this.infoPanelTableComponent?.rowsSelected.map(task => {
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

  clearRowSelected() {
    this.infoPanelTableComponent?.deselectAll();
  }

  getTaskRendered() {
    return this.infoPanelTableComponent ? this.infoPanelTableComponent.getTaskRendered() : [];
  }

  setNodeDataRefresh(tasks: any) {
    this.infoPanelTableComponent?.setNodeDataRefresh(tasks);
  }
}
