import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';
import { AddNodeDeployDialogComponent } from 'src/app/map/add-node-deploy-dialog/add-node-deploy-dialog.component';
import { CreateNodeSnapshotDialogComponent } from '../../create-node-snapshot-dialog/create-node-snapshot-dialog.component';
import { DeleteNodeSnapshotDialogComponent } from '../../delete-node-snapshot-dialog copy/delete-node-snapshot-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CMRemoteService {

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) { }

  getMenu(activeNodes: any[]) {
    const webConsole = {
      id: "web_console",
      content: "Web Console",
      selector: "node[icon]",
      onClickFunction: (event: any) => {
        const target = event.target;
        const data = target.data();
        const url = data.url;
        if (url != null) {
          window.open(url);
        } else {
          this.toastr.warning('Web Console not accessible')
        }
      },
      hasTrailingDivider: true,
      disabled: false,
    }
    const power = {
      id: "power",
      content: "Power",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "power_on",
          content: "Power On",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const target = event.target;
            const data = target.data();
            this.add_task('power_on_node', data.node_id.toString());
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "power_off",
          content: "Power Off",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const target = event.target;
            const data = target.data();
            this.add_task('power_off_node', data.node_id.toString());
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "power_restart",
          content: "Restart",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const target = event.target;
            const data = target.data();
            this.add_task('restart_node', data.node_id.toString());
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
    const deploy = {
      id: "deploy",
      content: "Deploy",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "deploy_new",
          content: "New",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const dialogData = {
              activeNodes
            };
            this.dialog.open(AddNodeDeployDialogComponent, { width: '600px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_delete",
          content: "Delete",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const target = event.target;
            const data = target.data();
            this.add_task('delete_node', data.node_id.toString());
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_update",
          content: "Update",
          selector: "node[icon]",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
    const snapshot = {
      id: "snapshot",
      content: "Snapshot",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "snapshot_create",
          content: "Create",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const dialogData = {
              activeNodes
            };
            this.dialog.open(CreateNodeSnapshotDialogComponent, { width: '600px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "snapshot_delete",
          content: "Delete",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const dialogData = {
              activeNodes,
              names: []
            };
            this.dialog.open(DeleteNodeSnapshotDialogComponent, { width: '600px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "snapshot_revert",
          content: "Revert",
          selector: "node[icon]",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
    return {
      id: "node_remote",
      content: "Remote",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        webConsole,
        power,
        deploy,
        snapshot
      ]
    }
  }

  add_task(jobName: string, pks: string) {
    const jsonData = { job_name: jobName, pks };
    this.taskService.add(jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(error.message);
        return throwError(() => error);
      })
    ).subscribe(respData => {
      this.toastr.success("Task added to the queue");
    });
  }
}
