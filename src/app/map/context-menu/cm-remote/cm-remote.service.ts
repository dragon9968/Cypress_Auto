import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';
import { NodeService } from "../../../core/services/node/node.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../core/services/server-connect/server-connect.service";
import { AddUpdateNodeDeployDialogComponent } from 'src/app/map/deployment-dialog/deployment-node-dialog/add-update-node-deploy-dialog/add-update-node-deploy-dialog.component';
import { CreateNodeSnapshotDialogComponent } from '../../deployment-dialog/deployment-node-dialog/create-node-snapshot-dialog/create-node-snapshot-dialog.component';
import { DeleteNodeSnapshotDialogComponent } from '../../deployment-dialog/deployment-node-dialog/delete-node-snapshot-dialog/delete-node-snapshot-dialog.component';
import { RevertNodeSnapshotDialogComponent } from "../../deployment-dialog/deployment-node-dialog/revert-node-snapshot-dialog/revert-node-snapshot-dialog.component";
import { DeleteNodeDeployDialogComponent } from "../../deployment-dialog/deployment-node-dialog/delete-node-deploy-dialog/delete-node-deploy-dialog.component";
import { ProjectService } from 'src/app/project/services/project.service';
import { AddDeletePGDeployDialogComponent } from "../../deployment-dialog/deployment-pg-dialog/add-delete-pg-deploy-dialog/add-delete-pg-deploy-dialog.component";
import { UpdateFactsNodeDialogComponent } from "../../deployment-dialog/deployment-node-dialog/update-facts-node-dialog/update-facts-node-dialog.component";
import { MapService } from 'src/app/core/services/map/map.service';
import { NodeToolsDialogComponent } from "../../deployment-dialog/deployment-node-dialog/node-tools-dialog/node-tools-dialog.component";
import { RemoteCategories } from "../../../core/enums/remote-categories.enum";
import { Store } from "@ngrx/store";
import { selectIsHypervisorConnect } from "../../../store/server-connect/server-connect.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMRemoteService implements OnDestroy{

  selectIsHypervisorConnect$ = new Subscription();
  isHypervisorConnect = false;
  connectionCategory = '';

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private taskService: TaskService,
    private nodeService: NodeService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService,
    private projectService: ProjectService,
    private mapService: MapService
  ) {
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      this.isHypervisorConnect = isHypervisorConnect
      if (this.isHypervisorConnect) {
        this.connectionCategory = RemoteCategories.HYPERVISOR
      } else {
        this.connectionCategory = RemoteCategories.CONFIGURATOR
      }
    })
  }

  ngOnDestroy(): void {
    this.selectIsHypervisorConnect$.unsubscribe();
  }

  getNodeRemoteMenu(activeNodes: any[]) {
    const webConsole = {
      id: "web_console",
      content: "Web Console",
      selector: "node[icon]",
      onClickFunction: (event: any) => {
        const target = event.target;
        const data = target.data();
        const connection = this.serverConnectionService.getConnection(this.connectionCategory);
        const connectionId = connection ? connection?.id : 0;
        const collectionId = this.projectService.getCollectionId();
        let url = data.url
        if (connectionId || collectionId != 0) {
          this.mapService.getMapStatus(collectionId, connection?.id).pipe(
            catchError(err => {
              this.toastr.error('Web Console not accessible', 'Error');
              return throwError(() => err)
            })
          ).subscribe(mapStatus => {
            for (const [key, value] of Object.entries(mapStatus.vm_status)) {
              const d = value as any
              if (d.id === data.node_id) {
                url = d.url
              }
            }
            if (url != null) {
              window.open(url);
            } else {
              this.toastr.warning('Web Console not accessible')
            }
          })
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
            const activeNodeIds = activeNodes.map(ele => ele.data('node_id')).join(',');
            this.add_task('node', 'power_on_node', activeNodeIds, this.connectionCategory);
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "power_off",
          content: "Power Off",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const activeNodeIds = activeNodes.map(ele => ele.data('node_id')).join(',');
            this.add_task('node', 'power_off_node', activeNodeIds, this.connectionCategory);
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "power_restart",
          content: "Restart",
          selector: "node[icon]",
          onClickFunction: (event: any) => {
            const activeNodeIds = activeNodes.map(ele => ele.data('node_id')).join(',');
            this.add_task('node', 'restart_node', activeNodeIds, this.connectionCategory);
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
              activeNodes,
              category: this.connectionCategory
            };
            this.dialog.open(AddUpdateNodeDeployDialogComponent, { width: '600px', data: dialogData, autoFocus: false });
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
              activeNodes,
              category: this.connectionCategory
            };
            this.dialog.open(DeleteNodeDeployDialogComponent, { width: '600px', data: dialogData, autoFocus: false });
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
              activeNodes,
              category: this.connectionCategory
            };
            this.dialog.open(AddUpdateNodeDeployDialogComponent, { width: '600px', data: dialogData, autoFocus: false });
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
              activeNodes,
              category: this.connectionCategory
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
              const connection = this.serverConnectionService.getConnection(this.connectionCategory);
              const pks = activeNodes.map(ele => ele.data('node_id'));
              this.nodeService.getSnapshots({pks: pks, collection_id: collectionId, connection_id: connection ? connection?.id : 0}).subscribe({
                next: response => {
                  const dialogData = {
                    activeNodes,
                    names: response,
                    category: this.connectionCategory
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
              const connection = this.serverConnectionService.getConnection(this.connectionCategory);
              const pks = activeNodes.map(ele => ele.data('node_id'));
              this.nodeService.getSnapshots({pks: pks, collection_id: collectionId, connection_id: connection ? connection?.id : 0}).subscribe({
                next: response => {
                  const dialogData = {
                    activeNodes,
                    names: response,
                    category: this.connectionCategory
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
          activeNodes,
          category: this.connectionCategory
        };
        this.dialog.open(UpdateFactsNodeDialogComponent, { width: '600px', data: dialogData });
      },
      hasTrailingDivider: true,
      disabled: false,
    }
    const tool = {
      id: 'tool',
      content: 'Tool',
      selector: 'node[icon]',
      submenu: [
        {
          id: 'ping_test',
          content: 'Ping',
          selector: 'node[icon]',
          onClickFunction: () => {
            const dialogData = {
              activeNodes,
              jobName: 'ping_test',
              category: this.connectionCategory
            }
            this.dialog.open(NodeToolsDialogComponent, { width: '450px', data: dialogData, autoFocus: false })
          },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: 'shell_command',
          content: 'Shell Command',
          selector: 'node[icon]',
          onClickFunction: () => {
            const dialogData = {
              activeNodes,
              jobName: 'shell_command',
              category: this.connectionCategory
            }
            this.dialog.open(NodeToolsDialogComponent, { width: '450px', data: dialogData, autoFocus: false })
          },
          hasTrailingDivider: true,
          disabled: false,
        }
      ],
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
        tool,
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
              message: 'Deploy this port group?',
              category: this.connectionCategory
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
              message: 'Delete port group(s)?',
              category: this.connectionCategory
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
              message: 'Update port group(s)?',
              category: this.connectionCategory
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

  add_task(category: string, jobName: string, pks: string, connectionCategory: string) {
    let connection = this.serverConnectionService.getConnection(connectionCategory);
    const jsonData = { job_name: jobName, category, pks, hypervisor_id: connection ? connection?.id : 0 };
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
}
