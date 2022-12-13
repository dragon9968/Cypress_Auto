import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { Injectable, Input } from '@angular/core';
import { Subscription, throwError } from "rxjs";
import { MapService } from "../map/map.service";
import { NodeService } from "../node/node.service";
import { GroupService } from "../group/group.service";
import { DomainService } from "../domain/domain.service";
import { ProjectService } from "../../../project/services/project.service";
import { HelpersService } from "../helpers/helpers.service";
import { UserTaskService } from "../user-task/user-task.service";
import { PortGroupService } from "../portgroup/portgroup.service";
import { InterfaceService } from "../interface/interface.service";
import { DomainUserService } from "../domain-user/domain-user.service";
import { selectVMStatus } from "../../../store/project/project.selectors";
import { selectIsConnect } from "../../../store/server-connect/server-connect.selectors";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";
import { retrievedGroups } from "../../../store/group/group.actions";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { retrievedUserTasks } from "../../../store/user-task/user-task.actions";
import { retrievedIsChangeDomainUsers } from "../../../store/domain-user-change/domain-user-change.actions";
import { AddUpdatePGDialogComponent } from "../../../map/add-update-pg-dialog/add-update-pg-dialog.component";
import { NodeBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component";
import { ShowUserTaskDialogComponent } from "../../../map/info-panel/info-panel-task/show-user-task-dialog/show-user-task-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../../map/add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../../map/add-update-group-dialog/add-update-group-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../../map/add-update-domain-dialog/add-update-domain-dialog.component";
import { UpdateDomainUserDialogComponent } from "../../../map/info-panel/info-panel-domain/update-domain-user-dialog/update-domain-user-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../../map/add-update-interface-dialog/add-update-interface-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class InfoPanelService {
  @Input() ur: any;
  @Input() cy: any;
  selectNode$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectPortGroup$ = new Subscription();
  selectDomainUser$ = new Subscription();
  selectVMStatus$ = new Subscription();
  selectIsConnect$ = new Subscription();
  nodes!: any[];
  portGroups!: any[];
  domainUsers!: any[];
  vmStatus!: boolean;
  isGroupBoxesChecked!: boolean;
  isConnect!: boolean;
  statusColorLookup = {
    off: '#D63222', //red
    on: '#44D62C', // green
    unknown: '#FFE900' // yellow
  }

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private mapService: MapService,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private interfaceService: InterfaceService,
    private portGroupService: PortGroupService,
    private groupService: GroupService,
    private domainService: DomainService,
    private userTaskService: UserTaskService,
    private projectService: ProjectService,
    private domainUserService: DomainUserService,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectNode$ = this.store.select(selectNodesByCollectionId).subscribe(nodes => this.nodes = nodes);
    this.selectPortGroup$ = this.store.select(selectPortGroups).subscribe(portGroups => this.portGroups = portGroups);
    this.selectDomainUser$ = this.store.select(selectDomainUsers).subscribe(domainUsers => this.domainUsers = domainUsers);
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatus => this.vmStatus = vmStatus);
    this.selectIsConnect$ = this.store.select(selectIsConnect).subscribe(isConnect => this.isConnect = isConnect);
  }

  viewInfoPanel(tabName: string, id: any) {
    switch (tabName) {
      case 'domain':
        this.domainService.get(id).subscribe(domainData => {
          const dialogData = {
            mode: 'view',
            genData: domainData.result
          };
          this.dialog.open(AddUpdateDomainDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        });
        break;
      case 'group':
        this.groupService.get(id).subscribe(groupData => {
          const dialogData = {
            mode: 'view',
            genData: groupData.result,
            collection_id: groupData.result.collection_id,
            map_category: 'logical'
          };
          this.dialog.open(AddUpdateGroupDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        });
        break;
      case 'userTask':
        this.userTaskService.get(id).subscribe(userTaskData => {
          const dialogData = {
            mode: 'postTask',
            genData: userTaskData.result
          };
          this.dialog.open(ShowUserTaskDialogComponent, { width: `${screen.width}px`, autoFocus: false, data: dialogData });
        });
        break;
      case 'edge':
        this.interfaceService.get(id).subscribe(interfaceData => {
          const dialogData = {
            mode: 'view',
            genData: interfaceData.result,
          };
          this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', data: dialogData });
        });
        break;
      case 'portGroup':
        this.portGroupService.get(id).subscribe(pgData => {
          const dialogData = {
            mode: 'view',
            genData: pgData.result,
          };
          this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', data: dialogData });
        });
        break;
      case 'node':
        this.nodeService.get(id).subscribe(nodeData => {
          const dialogData = {
            mode: 'view',
            genData: nodeData.result,
          }
          this.dialog.open(AddUpdateNodeDialogComponent, { width: '600px', data: dialogData });
        });
        break;
      case 'domainUser':
        this.domainUserService.get(id).subscribe(domainUserData => {
          this.domainService.get(domainUserData.result.domain_id).subscribe(domainData => {
            const dialogData = {
              genData: domainUserData.result,
              domain: domainData.result,
              mode: 'view'
            };
            this.dialog.open(UpdateDomainUserDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
          }
          )
        });
        break;
      default:
        this.toastr.warning('Please select an item before opening', 'Warning');
    }
  }

  openEditInfoPanelForm(cy: any, tabName: string, id: any, ids: any[] = []) {
    switch (tabName) {
      case 'edge':
        if (ids.length > 0 && id == undefined) {
          const dialogData = {
            genData: { ids: ids },
            cy
          };
          this.dialog.open(InterfaceBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        } else if (ids.length === 0 && id) {
          this.interfaceService.get(id).subscribe(interfaceData => {
            const dialogData = {
              mode: 'update',
              genData: interfaceData.result,
              cy
            }
            this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
          });
        }
        break;
      case 'portGroup':
        if (ids.length > 0 && id == undefined) {
          const dialogData = {
            genData: { ids: ids },
            cy
          }
          this.dialog.open(PortGroupBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        } else if (ids.length === 0 && id) {
          this.portGroupService.get(id).subscribe(pgData => {
            const dialogData = {
              mode: 'update',
              genData: pgData.result,
              cy
            }
            this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
          });
        }
        break;
      case 'node':
        if (ids.length > 0 && id == undefined) {
          const dialogData = {
            genData: { ids: ids },
            cy
          }
          this.dialog.open(NodeBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        } else if (ids.length === 0 && id) {
          this.nodeService.get(id).subscribe(nodeData => {
            const dialogData = {
              mode: 'update',
              genData: nodeData.result,
              cy
            }
            this.dialog.open(AddUpdateNodeDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
          });
        }
        break;
      case 'group':
        this.groupService.get(id).subscribe(groupData => {
          const dialogData = {
            mode: 'update',
            genData: groupData.result,
            collection_id: groupData.result.collection_id,
            map_category: 'logical'
          };
          this.dialog.open(AddUpdateGroupDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        })
        break;
      case 'domainUser':
        this.domainUserService.get(id).subscribe(domainUserData => {
          this.domainService.get(domainUserData.result.domain_id).subscribe(domainData => {
            const dialogData = {
              genData: domainUserData.result,
              domain: domainData.result,
              mode: 'update'
            };
            this.dialog.open(UpdateDomainUserDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
          })
        })
        break;
      default:
        this.toastr.info('The info panel doesn\'t open yet');
    }
  }

  deleteInfoPanelAssociateMap(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
    deletedNodes: any[], deletedInterfaces: any[], tabName: string, id: any) {
    let idName = '';
    if (tabName == 'node') {
      idName = 'node_id';
    } else if (tabName == 'portGroup') {
      idName = 'pg_id';
    } else if (tabName == 'edge') {
      idName = 'interface_id';
    }
    activeEdges.filter(ele => ele.data(idName) === id).forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.ur?.do('removeEdge', edge);
        const index = activeEdges.findIndex(ele => ele.data(idName) === id);
        activeEdges.splice(index, 1);
        // TODO: this.tool_panel.update_components();
      }
    });

    activeNodes.concat(activePGs, activeGBs)
      .filter(ele => ele.data(idName) === id)
      .forEach((node: any) => {
        // Remove the interface is connecting to the Port Group or Node
        const interfacesDeleted = this.getEdgesConnectingToNode(node);
        for (let i = 0; i < activeEdges.length; i++) {
          const data = activeEdges[i].data();
          if (interfacesDeleted.includes(data.interface_id)) {
            activeEdges.splice(i, 1);
            i--;
          }
        }
        this.ur?.do("removeNode", node)
        if (this.isGroupBoxesChecked) {
          cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
            if (gb.children().length == 0) {
              this.ur?.do("removeNode", gb)
            }
          });
        }
        if (idName === 'node_id') {
          const indexNode = activeNodes.findIndex(ele => ele.data(idName) === id);
          activeNodes.splice(indexNode, 1);
        } else if (idName === 'pg_id') {
          const indexNode = activePGs.findIndex(ele => ele.data(idName) === id);
          activePGs.splice(indexNode, 1);
        }
        activeGBs.splice(0);
        // TODO: this.tool_panel.update_components();
      });
  }

  getEdgesConnectingToNode(node: any) {
    const interfacesDeleted: any[] = [];
    node.connectedEdges().forEach((ele: any) => {
      const data = ele.data();
      if (data && !data.new) {
        data.deleted = true;
        interfacesDeleted.push({
          'name': data.id,
          'interface_id': data.interface_id
        });
      }
    });
    return interfacesDeleted.map(ele => ele.interface_id);
  }

  deleteInfoPanelNotAssociateMap(tabName: string, ids: any[] = []) {
    if (ids.length > 0) {
      switch (tabName) {
        case 'domain':
          ids.map(id => this.deleteDomain(id));
          break;
        case 'group':
          ids.map(id => this.deleteGroup(id));
          break;
        case 'domainUser':
          ids.map(id => this.deleteDomainUser(id));
          break;
        case 'userTask':
          ids.map(id => this.deleteUserTask(id));
          break;
        default:
          this.toastr.warning('Please open the table info before deleting', 'Warning');
      }
    } else {
      this.toastr.warning('Please select the item before deleting', 'Warning');
    }
  }

  deleteDomain(id: any) {
    this.domainService.get(id).subscribe(domainData => {
      const domain = domainData.result;
      const isDomainInNode = this.nodes.some(ele => ele.domain_id === domain.id);
      const isDomainInPG = this.portGroups.some(ele => ele.domain_id === domain.id);
      const domainName = domain.name;
      if (isDomainInNode && isDomainInPG) {
        this.toastr.error(`Port groups and nodes are still associated with domain ${domainName}`);
      } else if (isDomainInNode) {
        this.toastr.error(`Nodes are still associated with this domain ${domainName}`);
      } else if (isDomainInPG) {
        this.toastr.error(`Port groups are still associated with domain ${domainName}`)
      } else {
        this.domainUsers
          .filter(ele => ele.domain_id === domain.id)
          .map(ele => {
            return this.domainUserService.delete(ele.id).subscribe({
              next: () => {
                this.toastr.success(`Deleted domain user ${ele.username}`, 'Success');
              },
              error: err => {
                this.toastr.error('Delete domain user failed', 'Error');
                throwError(() => err.message);
              }
            })
          });
        this.domainService.delete(domain.id).subscribe({
          next: () => {
            const collectionId = this.projectService.getCollectionId();
            this.domainService.getDomainByCollectionId(collectionId).subscribe(
              (data: any) => this.store.dispatch(retrievedDomains({ data: data.result }))
            );
            this.toastr.success(`Deleted domain ${domainName}`);
          },
          error: err => {
            this.toastr.error(`Delete domain ${domainName} failed`, 'Error');
            throwError(() => err.message);
          }
        })
      }
    });
  }

  deleteGroup(id: any) {
    this.groupService.delete(id).subscribe({
      next: () => {
        const collectionId = this.projectService.getCollectionId();
        this.groupService.getGroupByCollectionId(collectionId).subscribe(data => {
          this.store.dispatch(retrievedGroups({ data: data.result }));
        })
        this.toastr.success('Deleted Row', 'Success');
      },
      error: err => {
        this.toastr.error('Delete group failed', 'Error');
        throwError(() => err.message);
      }
    });
  }

  deleteDomainUser(id: any) {
    this.domainUserService.get(id).subscribe(data => {
      this.domainUserService.delete(id).subscribe({
        next: () => {
          this.store.dispatch(retrievedIsChangeDomainUsers({ isChangeDomainUsers: true }));
          this.toastr.success(`Deleted domain user ${data.result.username}`, 'Success');
        },
        error: err => {
          this.toastr.error('Delete domain user failed', 'Error');
          throwError(() => err.message);
        }
      })
    })
  }

  deleteUserTask(userTaskId: number) {
    this.userTaskService.delete(userTaskId).subscribe({
      next: () => {
        this.userTaskService.getAll().subscribe(data => {
          this.store.dispatch(retrievedUserTasks({ data: data.result }));
        })
        this.toastr.success('Deleted Row', 'Success');
      },
      error: error => {
        this.toastr.error(error.error.message, 'Error');
        throwError(() => error.message);
      }
    })
  }

  rerunTask(userTaskIds: any[]) {
    this.userTaskService.rerunTask({ pks: userTaskIds }).subscribe({
      next: value => {
        this.userTaskService.getAll().subscribe(data => {
          this.store.dispatch(retrievedUserTasks({ data: data.result }));
        })
        value.result.map((message: string) => {
          this.toastr.success(`Rerun task - ${message} `, 'Success');
        })
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error');
        throwError(() => err.message);
      }
    })
  }

  revokeTask(userTaskIds: any[]) {
    this.userTaskService.revokeTask({ pks: userTaskIds }).subscribe({
      next: value => {
        this.userTaskService.getAll().subscribe(data => {
          this.store.dispatch(retrievedUserTasks({ data: data.result }));
        })
        value.result.map((message: string) => {
          this.toastr.success(`Revoke task - ${message} `, 'Success');
        })
      },
      error: err => {
        this.toastr.error('Revoke task failed', 'Error');
        throwError(() => err.message);
      }
    })
  }

  postTask(userTaskIds: any[]) {
    this.userTaskService.postTask({ pks: userTaskIds }).subscribe({
      next: value => {
        this.userTaskService.getAll().subscribe(data => {
          this.store.dispatch(retrievedUserTasks({ data: data.result }));
        })
        value.result.map((message: string) => {
          this.toastr.success(`Post task - ${message} `, 'Success');
        })
      },
      error: err => {
        this.toastr.error('Post task failed', 'Error');
        throwError(() => err.message);
      }
    })
  }

  refreshTask() {
    this.userTaskService.refreshTask().subscribe({
      next: response => {
        this.toastr.success(response.message, 'Success');
        this.updateTaskList();
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error');
        throwError(() => err.message);
      }
    })
  }

  updateTaskList() {
    this.userTaskService.getAll().subscribe(data => {
      this.store.dispatch(retrievedUserTasks({ data: data.result }));
    })
  }

  delayedAlertNode(nodeName: string, nodeStatus: any) {
    const ele = this.cy?.nodes().filter(`[name='${nodeName}']`)[0];
    if (!ele) {
      return;
    }
    // set the VM Power and Status value in the tooltip
    ele.style({ 'background-opacity': '1' });
    ele.style({ 'border-width': '10px' });
    ele.style({ 'border-style': 'double' });
    ele.style({ 'border-opacity': '1' });
    const d = nodeStatus;
    if (d.state == "on" && d.status == "running") {
      ele.data('color', this.statusColorLookup.on);
      ele.style({ 'border-color': this.statusColorLookup.on });
    } else if (d.state == "on" && d.status == "notRunning") {
      ele.data("color", this.statusColorLookup.unknown);
      ele.style({ 'border-color': this.statusColorLookup.unknown });
    } else if (d.state == "off") {
      ele.data('color', this.statusColorLookup.off);
      ele.style({ 'border-color': this.statusColorLookup.off });
    } else if (!(d.state == false)) {
      ele.style({ 'background-opacity': '0' });
      ele.style({ 'border-opacity': '0' });
    } else {
      ele.style({ 'background-opacity': '0' });
      ele.style({ 'border-opacity': '0' });
    }
  }

  delayedAlertPortGroup(pgName: string, pgStatus: any) {
    const ele = this.cy?.nodes().filter(`[name='${pgName}']`)[0];
    if (!ele) {
      return;
    }
    if (pgStatus) {
      ele.style({ 'border-color': this.statusColorLookup.on });
      ele.style({ 'border-style': "double"});
      ele.style({ 'border-width': 7});
    }
  }

  removeVMStatusOnMap() {
    // Remove Node's status
    const nodes = this.cy?.nodes().filter('[icon]');
    if (nodes) {
      nodes.style('border-opacity', 0);
      nodes.style('border-width', 0);
      nodes.style('background-opacity', 0);
    }
    // Remove PortGroup's status
    const portGroups = this.cy?.nodes().filter((ele: any) => ele.data('elem_category') === 'port_group');
    if (portGroups) {
      portGroups.style({ 'border-width': 0 });
    }
  }

  changeVMStatusOnMap(collectionId: number, connectionId: number) {
    this.mapService.getVMStatus(collectionId, connectionId).subscribe(mapStatus => {
      this.removeVMStatusOnMap();
      for (const [key, value] of Object.entries(mapStatus.vm_status)) {
        this.delayedAlertNode(key, value);
      }
      for (const [key, value] of Object.entries(mapStatus.pg_status)) {
        this.delayedAlertPortGroup(key, value);
      }
    })
  }

  initVMStatus(collectionId: number, connectionId: number) {
    if (this.isConnect && this.vmStatus) {
      this.changeVMStatusOnMap(collectionId, connectionId);
    } else {
      this.removeVMStatusOnMap();
    }
  }
}
