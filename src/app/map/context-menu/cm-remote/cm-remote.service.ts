import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';
import { NodeService } from "../../../core/services/node/node.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../core/services/server-connect/server-connect.service";
import { AddUpdateNodeDeployDialogComponent } from 'src/app/map/add-update-node-deploy-dialog/add-update-node-deploy-dialog.component';
import { CreateNodeSnapshotDialogComponent } from '../../create-node-snapshot-dialog/create-node-snapshot-dialog.component';
import { DeleteNodeSnapshotDialogComponent } from '../../delete-node-snapshot-dialog/delete-node-snapshot-dialog.component';
import { RevertNodeSnapshotDialogComponent } from "../../revert-node-snapshot-dialog/revert-node-snapshot-dialog.component";
import { DeleteNodeDeployDialogComponent } from "../../delete-node-deploy-dialog/delete-node-deploy-dialog.component";
import { ProjectService } from 'src/app/project/services/project.service';
import { AddDeletePGDeployDialogComponent } from "../../add-delete-pg-deploy-dialog/add-delete-pg-deploy-dialog.component";
import { UpdateFactsNodeDialogComponent } from "../../update-facts-node-dialog/update-facts-node-dialog.component";
import { MapService } from 'src/app/core/services/map/map.service';

@Injectable({
  providedIn: 'root'
})
export class CMRemoteService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private taskService: TaskService,
    private nodeService: NodeService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService,
    private projectService: ProjectService,
    private mapService: MapService
  ) { }

  getNodeRemoteMenu(activeNodes: any[]) {
    const webConsole = {
      id: "web_console",
      content: "Web Console",
      selector: "node[icon]",
      onClickFunction: (event: any) => {
        const target = event.target;
        const data = target.data();
        const url = this.getNodeUrl(data.node_id)
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
            this.add_task('node', 'power_on_node', data.node_id.toString());
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
            this.add_task('node', 'power_off_node', data.node_id.toString());
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
            this.add_task('node', 'restart_node', data.node_id.toString());
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
              jobName: 'deploy_node',
              activeNodes
            };
            this.dialog.open(AddUpdateNodeDeployDialogComponent, { width: '600px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_delete",
          content: "Delete",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const dialogData = {
              activeNodes
            };
            this.dialog.open(DeleteNodeDeployDialogComponent, { width: '600px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_update",
          content: "Update",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const dialogData = {
              jobName: 'update_node',
              activeNodes
            };
            this.dialog.open(AddUpdateNodeDeployDialogComponent, { width: '600px', data: dialogData });
          },
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
            if (activeNodes.length >= 1) {
              const collectionId = this.projectService.getCollectionId()
              const connection = this.serverConnectionService.getConnection();
              const pks = activeNodes.map(ele => ele.data('node_id'));
              this.nodeService.getSnapshots({pks: pks, collection_id: collectionId, connection_id: connection ? connection?.id : 0}).subscribe({
                next: response => {
                  const dialogData = {
                    activeNodes,
                    names: response.result
                  };
                  this.dialog.open(DeleteNodeSnapshotDialogComponent, { width: '600px', data: dialogData });
                }
              })
            } else {
              this.toastr.warning('Please select the node before deleting', 'Warning');
            }
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "snapshot_revert",
          content: "Revert",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            if (activeNodes.length >= 1) {
              const collectionId = this.projectService.getCollectionId()
              const connection = this.serverConnectionService.getConnection();
              const pks = activeNodes.map(ele => ele.data('node_id'));
              this.nodeService.getSnapshots({pks: pks, collection_id: collectionId, connection_id: connection ? connection?.id : 0}).subscribe({
                next: response => {
                  const dialogData = {
                    activeNodes,
                    names: response.result
                  };
                  this.dialog.open(RevertNodeSnapshotDialogComponent, { width: '600px', data: dialogData });
                }
              })
            } else {
              this.toastr.warning('Please select the node before reverting', 'Warning');
            }
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
    const updateFacts = {
      id: "update_facts",
      content: "Update Facts",
      selector: "node[icon]",
      onClickFunction: (event: any) => {
        const dialogData = {
          activeNodes
        };
        this.dialog.open(UpdateFactsNodeDialogComponent, { width: '600px', data: dialogData });
      },
      hasTrailingDivider: true,
      disabled: false,
    }
    return {
      id: "node_remote",
      content: "Remote",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        webConsole,
        deploy,
        power,
        snapshot,
        updateFacts
      ]
    }
  }

  getPortGroupRemoteMenu(activePGs: any[]) {
    const deploy = {
      id: "deploy_pg",
      content: "Deploy",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "deploy_new_pg",
          content: "New",
          selector: "node[elem_category='port_group']",
          onClickFunction: (event: any) => {
            const dialogData = {
              jobName: 'create_pg',
              activePGs,
              message: 'Deploy this port group?'
            };
            this.dialog.open(AddDeletePGDeployDialogComponent, { width: '450px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_delete_pg",
          content: "Delete",
          selector: "node[elem_category='port_group']",
          onClickFunction: (event: any) => {
            const dialogData = {
              jobName: 'delete_pg',
              activePGs,
              message: 'Delete port group(s)?'
            };
            this.dialog.open(AddDeletePGDeployDialogComponent, { width: '450px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "deploy_update",
          content: "Update",
          selector: "node[elem_category='port_group']",
          onClickFunction: (event: any) => {
            const dialogData = {
              jobName: 'update_pg',
              activePGs,
              message: 'Update port group(s)?'
            };
            this.dialog.open(AddDeletePGDeployDialogComponent, { width: '450px', data: dialogData });
          },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }

    return {
      id: "pg_remote",
      content: "Remote",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        deploy,
      ]
    }
  }

  add_task(category: string, jobName: string, pks: string) {
    const connection = this.serverConnectionService.getConnection();
    const jsonData = { job_name: jobName, category, pks, connection_id: connection ? connection?.id : 0 };
    this.taskService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData => {
      this.infoPanelService.updateTaskList();
      this.toastr.success("Task added to the queue", "Success");
    });
  }

  getNodeUrl(nodeId: any) {
    const connection = this.serverConnectionService.getConnection();
    const connectionId = connection ? connection?.id : 0;
    const collectionId = this.projectService.getCollectionId();
    if (connectionId || collectionId != 0) {
      this.mapService.getVMStatus(collectionId, connection?.id).subscribe(mapStatus => {
        for (const [key, value] of Object.entries(mapStatus.vm_status)) {
          const d = value as any
          if (d.id === nodeId) {
            return d.url
          }
        }
      })  
    }
    return null
  }
}
