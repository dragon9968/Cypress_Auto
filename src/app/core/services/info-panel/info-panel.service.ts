import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { forkJoin, of, Subscription, throwError } from "rxjs";
import { Injectable, Input, OnDestroy } from '@angular/core';
import { MapService } from "../map/map.service";
import { GroupService } from "../group/group.service";
import { DomainService } from "../domain/domain.service";
import { ProjectService } from "../../../project/services/project.service";
import { UserTaskService } from "../user-task/user-task.service";
import { PortGroupService } from "../portgroup/portgroup.service";
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InterfaceService } from "../interface/interface.service";
import { DomainUserService } from "../domain-user/domain-user.service";
import { retrievedMap } from "../../../store/map/map.actions";
import { ServerConnectService } from "../server-connect/server-connect.service";
import { selectVMStatus } from "../../../store/project/project.selectors";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { retrievedGroups } from "../../../store/group/group.actions";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
import { retrievedUserTasks } from "../../../store/user-task/user-task.actions";
import { retrievedMapSelection } from "../../../store/map-selection/map-selection.actions";
import { selectNodesByProjectId } from "../../../store/node/node.selectors";
import { selectInterfacesManagement } from "../../../store/interface/interface.selectors";
import { retrievedIsChangeDomainUsers } from "../../../store/domain-user-change/domain-user-change.actions";
import { retrievedPortGroupsManagement } from "../../../store/portgroup/portgroup.actions";
import { retrievedInterfacesManagement } from "../../../store/interface/interface.actions";
import { selectPortGroups, selectPortGroupsManagement } from "../../../store/portgroup/portgroup.selectors";
import { retrievedIsHypervisorConnect } from "src/app/store/server-connect/server-connect.actions";
import { retrievedVMStatus } from "src/app/store/project/project.actions";
import { RemoteCategories } from "../../enums/remote-categories.enum";
import { PortGroupRandomizeSubnetModel } from "../../models/port-group.model";
import { NodeService } from "../node/node.service";

@Injectable({
  providedIn: 'root'
})
export class InfoPanelService implements OnDestroy {
  @Input() ur: any;
  @Input() cy: any;
  selectNode$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectPortGroup$ = new Subscription();
  selectDomainUser$ = new Subscription();
  selectVMStatus$ = new Subscription();
  selectPortGroupsManagement$ = new Subscription();
  selectInterfacesManagement$ = new Subscription();
  nodes!: any[];
  portGroups!: any[];
  domainUsers!: any[];
  portGroupsManagement: any[] = [];
  interfacesManagement: any[] = [];
  vmStatus!: boolean;
  isGroupBoxesChecked!: boolean;
  statusColorLookup = {
    off: '#D63222', //red
    on: '#44D62C', // green
    unknown: '#FFE900' // yellow
  }
  nodeIdsDeployed: any[] = [];
  portGroupIdsDeployed: any[] = [];
  interfacePks: any[] = [];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private mapService: MapService,
    private interfaceService: InterfaceService,
    private portGroupService: PortGroupService,
    private nodeService: NodeService,
    private groupService: GroupService,
    private domainService: DomainService,
    private helpersService: HelpersService,
    private userTaskService: UserTaskService,
    private projectService: ProjectService,
    private domainUserService: DomainUserService,
    private serverConnectionService: ServerConnectService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectNode$ = this.store.select(selectNodesByProjectId).subscribe(nodes => this.nodes = nodes);
    this.selectPortGroup$ = this.store.select(selectPortGroups).subscribe(portGroups => this.portGroups = portGroups);
    this.selectDomainUser$ = this.store.select(selectDomainUsers).subscribe(domainUsers => this.domainUsers = domainUsers);
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatus => this.vmStatus = vmStatus);
    this.selectPortGroupsManagement$ = this.store.select(selectPortGroupsManagement).subscribe(
      portGroupsData => this.portGroupsManagement = portGroupsData
    )
    this.selectInterfacesManagement$ = this.store.select(selectInterfacesManagement).subscribe(
      interfacesData => this.interfacesManagement = interfacesData
    )
  }

  ngOnDestroy(): void {
    this.selectNode$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectPortGroup$.unsubscribe();
    this.selectDomainUser$.unsubscribe();
    this.selectVMStatus$.unsubscribe();
    this.selectPortGroupsManagement$.unsubscribe();
  }

  deleteInfoPanelAssociateMap(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], tabName: string, id: any) {
    let idName = '';
    if (tabName == 'node') {
      idName = 'node_id';
    } else if (tabName == 'portgroup') {
      idName = 'pg_id';
    } else if (tabName == 'edge') {
      idName = 'interface_pk';
    }
    activeEdges.filter(ele => ele.data(idName) === id).forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.ur?.do('removeEdge', { cy, edge });
        const index = activeEdges.findIndex(ele => ele.data(idName) === id);
        activeEdges.splice(index, 1);
      }
    });

    activeNodes.concat(activePGs, activeGBs)
      .filter(ele => ele.data(idName) === id)
      .forEach((node: any) => {
        // Remove the interface is connecting to the Port Group or Node
        const interfacesDeleted = this.getEdgesConnectingToNode(node);
        for (let i = 0; i < activeEdges.length; i++) {
          const data = activeEdges[i].data();
          if (interfacesDeleted.includes(data.interface_pk)) {
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
          'interface_pk': data.interface_pk
        });
      }
    });
    return interfacesDeleted.map(ele => ele.interface_pk);
  }

  deleteInfoPanelNotAssociateMap(tabName: string, ids: any[] = []) {
    if (ids.length > 0) {
      switch (tabName) {
        case 'domain':
          ids.map(id => this.deleteDomain(id));
          break;
        case 'group':
          forkJoin(ids.map(id => {
            return this.groupService.delete(id).pipe(
              catchError(err => {
                this.toastr.error('Delete group failed', 'Error');
                return throwError(() => err)
              })
            )
          })).subscribe((_) => {
            const projectId = this.projectService.getProjectId();
            this.groupService.getGroupByProjectId(projectId).subscribe(data => {
              this.store.dispatch(retrievedGroups({ data: data.result }));
            })
            this.mapService.getMapData('logical', projectId).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
          })
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
            return this.domainUserService.delete(ele.id).pipe(
              catchError(err => {
                this.toastr.error('Delete domain user failed', 'Error');
                return throwError(() => err.message);
              })
            ).subscribe((_) => {
              this.toastr.success(`Deleted domain user ${ele.username}`, 'Success');
            })
          });
        this.domainService.delete(domain.id).pipe(
          catchError(err => {
            this.toastr.error(`Delete domain ${domainName} failed`, 'Error');
            return throwError(() => err.message);
          })
        ).subscribe(() => {
          const projectId = this.projectService.getProjectId();
          this.domainService.getDomainByProjectId(projectId).subscribe(
            (data: any) => {
              this.toastr.success(`Deleted domain ${domainName}`);
              this.store.dispatch(retrievedDomains({ data: data.result }))
            }
          );
          this.groupService.getGroupByProjectId(projectId).subscribe(data => {
            this.toastr.success(`Deleted group related to domain ${domainName}`);
            this.store.dispatch(retrievedGroups({ data: data.result }));
          })
        })
      }
    });
  }

  deleteGroup(id: any) {
    this.groupService.delete(id).subscribe({
      next: () => {
        const projectId = this.projectService.getProjectId();
        this.groupService.getGroupByProjectId(projectId).subscribe(data => {
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

  showNodesDeployed(nodesDeployed: any, vmStatus: any) {
    if (nodesDeployed && nodesDeployed.length > 0) {
      vmStatus.map((nodeStatus: any) => {
        const ele = this.cy.nodes().filter((node: any) => node.data('node_id') === nodeStatus.id)[0];
        if (!ele) {
          return;
        }
        // Add new deploy-status property for the node
        ele.data('deploy-status', nodeStatus);

        // set the VM Power and Status value in the tooltip
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
        }
      })
      nodesDeployed.style({
        'background-opacity': '0',
        'border-width': '7px',
        'border-style': 'solid',
        'border-opacity': '0'
      });
      nodesDeployed.animate({
        style: {
          'background-opacity': '1',
          'border-opacity': '1',
        },
        easing: 'ease',
        duration: 1500,
        complete: () => {
          nodesDeployed.addClass('node-deployed');
        }
      })
    }
  }

  showPortGroupsDeployed(portGroupsDeployed: any, portGroupStatus: any) {
    if (portGroupsDeployed && portGroupsDeployed.length > 0) {
      portGroupStatus.map((pg: any) => {
        const ele = this.cy.nodes().filter(
          (portGroup: any) => portGroup.data('elem_category') === 'port_group' && portGroup.data('pg_id') === pg.id
        )[0];
        // Add new deploy-status property for the port group
        ele.data('deploy-status', pg);
        const d = pg;
        if (d.state == "notConflicted" && d.status == "good") {
          ele.style({ 'border-color': this.statusColorLookup.on });
        } else if (d.state == "conflicted" && d.status == "good") {
          ele.style({ 'border-color': this.statusColorLookup.unknown });
        } else if (d.status == "notGood") {
          ele.style({ 'border-color': this.statusColorLookup.off });
        }
      })
      portGroupsDeployed.style({
        'border-style': 'double',
        'border-width': 0,
        'border-opacity': 0
      })
      portGroupsDeployed.animate({
        style: {
          'border-width': 7,
          'border-opacity': '1'
        },
        easing: 'ease',
        duration: 1500,
        complete: () => {
          portGroupsDeployed.addClass('pg-deployed');
        }
      })
    }
  }

  removeMapStatusOnMap() {
    this.removeNodesStatusOnMap();
    this.removePortGroupsStatusOnMap();
  }

  removeNodesStatusOnMap() {
    // Remove Node's status
    const nodes = this.cy?.nodes().filter('[icon]');
    if (nodes) {
      nodes.animate({
        style: {
          'background-opacity': 0,
          'border-width': 0,
          'border-opacity': 0
        },
        easing: 'ease',
        duration: 1500,
        complete: () => {
          nodes.stop();
        }
      })
      // Remove the node-deployed class and deploy-status property in all nodes.
      nodes.removeClass('node-deployed');
      nodes.map((node: any) => node.data('deploy-status', {}));
    }
  }

  removePortGroupsStatusOnMap() {
    // Remove PortGroup's status
    const portGroups = this.cy?.nodes().filter((ele: any) => ele.data('elem_category') === 'port_group');
    if (portGroups) {
      portGroups.animate({
        style: {
          'border-width': 0,
          'border-opacity': 0
        },
        easing: 'ease',
        duration: 1500,
        complete: () => {
          portGroups.stop();
        }
      })
      // Remove the pg-deployed class and deploy-status property in all nodes.
      portGroups.removeClass('pg-deployed');
      portGroups.map((portGroup: any) => portGroup.data('deploy-status', {}));
    }
  }

  changeVMStatusOnMap(projectId: number, connectionId: number) {
    this.mapService.getMapStatus(projectId, connectionId)
      .pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          const connection = this.serverConnectionService.getConnection(RemoteCategories.HYPERVISOR);
          if (connection) {
            const jsonData = {
              pk: connection.id,
            }
            this.serverConnectionService.disconnect(RemoteCategories.HYPERVISOR, jsonData).pipe(
              catchError(err => {
                this.toastr.error('Could not to disconnect from Server', 'Error');
                return throwError(() => err.error.message);
              })).subscribe(() => {
                this.store.dispatch(retrievedIsHypervisorConnect({ data: false }));
                this.store.dispatch(retrievedVMStatus({ vmStatus: undefined }));
                this.toastr.info(`Disconnected from ${connection.name} server!`, 'Info');
              })
          }
          return throwError(() => e);
        })
      )
      .subscribe(mapStatus => {
        if (this.cy) {
          let nodesDeployed, portGroupsDeployed, vmStatus, portGroupStatus;
          if (mapStatus.vm_status) {
            vmStatus = Object.values(mapStatus.vm_status);
            this.nodeIdsDeployed = vmStatus.map((ele: any) => ele.id);
            nodesDeployed = this.cy.nodes().filter((node: any) => this.nodeIdsDeployed.includes(node.data('node_id')));
          }

          if (mapStatus.pg_status) {
            portGroupStatus = Object.values(mapStatus.pg_status);
            this.portGroupIdsDeployed = portGroupStatus.map((ele: any) => ele.id);
            portGroupsDeployed = this.cy.nodes().filter((portGroup: any) => this.portGroupIdsDeployed.includes(portGroup.data('pg_id')));
          }

          if (!this.isNodesDeployedShowed(vmStatus)) {
            this.removeNodesStatusOnMap();
            this.showNodesDeployed(nodesDeployed, vmStatus);
          }

          if (!this.isPortGroupsDeployedShowed(portGroupStatus)) {
            this.removePortGroupsStatusOnMap();
            this.showPortGroupsDeployed(portGroupsDeployed, portGroupStatus);
          }
        }
      });
  }

  isNodesDeployedShowed(vmStatus: any) {
    let result = true;
    const nodesDeployedShowed = this.cy.filter((node: any) => node.hasClass('node-deployed'));
    const nodeIdsDeployedShowed = nodesDeployedShowed.map((node: any) => node.data('node_id'));
    const isNodesDeployed = JSON.stringify(nodeIdsDeployedShowed.sort()) === JSON.stringify(this.nodeIdsDeployed.sort());
    if (isNodesDeployed) {
      for (const nodeStatus of vmStatus) {
        if (nodeIdsDeployedShowed.includes(nodeStatus.id)) {
          const node = nodesDeployedShowed.find((node: any) => node.data('node_id') === nodeStatus.id);
          // Check node's status is updated or not
          if (JSON.stringify(node.data('deploy-status')) !== JSON.stringify(nodeStatus)) {
            result = false;
            break;
          }
        }
      }
    } else {
      return false;
    }
    return result;
  }

  isPortGroupsDeployedShowed(portGroupStatus: any) {
    let result = true;
    const portGroupsDeployedShowed = this.cy.filter((pg: any) => pg.hasClass('pg-deployed'));
    const portGroupIdsDeployedShowed = portGroupsDeployedShowed.map((pg: any) => pg.data('pg_id'));
    const isPGsDeploy = JSON.stringify(portGroupIdsDeployedShowed.sort()) === JSON.stringify(this.portGroupIdsDeployed.sort());
    if (isPGsDeploy) {
      for (const pgStatus of portGroupStatus) {
        if (portGroupIdsDeployedShowed.includes(pgStatus.id)) {
          const portGroup = portGroupsDeployedShowed.find((pg: any) => pg.data('pg_id') === pgStatus.id);
          // Check port group's status is updated or not
          if (JSON.stringify(portGroup.data('deploy-status')) !== JSON.stringify(pgStatus)) {
            result = false;
            break;
          }
        }
      }
    } else {
      return false;
    }
    return result;
  }

  initPortGroupManagementStorage(projectId: string, category = 'management') {
    this.portGroupService.getByProjectIdAndCategory(projectId, category).subscribe(
      data => {
        const portGroupData = data.result;
        const portGroups = portGroupData.map((portGroup: any) => {
          portGroup.pg_id = portGroup.id;
          portGroup.id = `pg-${portGroup.id}`;
          portGroup.domain = portGroup.domain?.name;
          return portGroup;
        });
        this.store.dispatch(retrievedPortGroupsManagement({ data: portGroups }))
      }
    )
  }

  getNewPortGroupsManagement(newPortGroups: any) {
    let newPGsManagement = [...this.portGroupsManagement];
    newPortGroups.map((newPortGroup: any) => {
      const isExistInPGsManagement = this.portGroupsManagement.some(pg => pg.pg_id === newPortGroup.id);
      newPortGroup.pg_id = newPortGroup.id;
      newPortGroup.id = `pg-${newPortGroup.id}`;
      newPortGroup.domain = newPortGroup.domain?.name;
      if (isExistInPGsManagement) {
        const index = newPGsManagement.findIndex(ele => ele.pg_id === newPortGroup.pg_id);
        newPGsManagement.splice(index, 1, newPortGroup);
      } else {
        newPGsManagement = newPGsManagement.concat(newPortGroup);
      }
    })
    return newPGsManagement;
  }

  initInterfaceManagementStorage(projectId: string, category = 'management') {
    this.interfaceService.getByProjectIdAndCategory(projectId, category).subscribe(
      data => {
        const portGroupData = data.result;
        const edges = portGroupData.map((edge: any) => {
          edge.interface_pk = edge.id;
          return edge;
        });
        this.store.dispatch(retrievedInterfacesManagement({ data: edges }))
      }
    )
  }

  getNewInterfacesManagement(newInterfaces: any) {
    let newInterfacesManagement = [...this.interfacesManagement];
    newInterfaces.map((newEdge: any) => {
      const isExistInEdgesManagement = this.interfacesManagement.some(edge => edge.interface_pk === newEdge.id);
      newEdge.interface_pk = newEdge.id;
      if (isExistInEdgesManagement) {
        const index = newInterfacesManagement.findIndex(ele => ele.interface_pk === newEdge.interface_pk);
        newInterfacesManagement.splice(index, 1, newEdge);
      } else {
        newInterfacesManagement = newInterfacesManagement.concat(newEdge);
      }
    })
    return newInterfacesManagement;
  }

  randomizeSubnetPortGroups(pks: number[], projectId: number) {
    const jsonData: PortGroupRandomizeSubnetModel = {
      pks: pks,
      project_id: projectId
    }
    this.portGroupService.randomizeSubnetBulk(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(response => {
      response.result.map((ele: any) => {
        const element = this.cy.getElementById('pg-' + ele.id);
        element.data('subnet', ele.subnet);
        element.data('name', ele.name);
      })
      this.updateInterfaceIPBasedOnPGId(pks);
      this.store.dispatch(retrievedMapSelection({ data: true }));
      this.toastr.success(response.message);
    })
  }

  updateInterfaceIPBasedOnPGId(portGroupIds: any) {
    portGroupIds.map((portGroupId: any) => {
      this.interfaceService.getByPortGroup(portGroupId).subscribe(response => {
        this.checkIpAlocation(response.result)
        if (this.interfacePks.length > 0) {
          this.interfaceService.randomizeIpBulk({ pks: this.interfacePks }).pipe(
            catchError((error: any) => {
              this.toastr.error(error.error.message);
              return throwError(error.error.message);
            })
          ).subscribe(data => {
            const interfaces = data.result;
            interfaces.map((ele: any) => {
              const element = this.cy.getElementById(ele.id);
              const ip_str = ele.ip ? ele.ip : "";
              const ip = ip_str.split(".");
              const last_octet = ip.length == 4 ? "." + ip[3] : "";
              element.data('ip', ip_str);
              element.data('ip_last_octet', last_octet);
            })
            data.message.map((message: string) => {
              this.toastr.success(message);
            });
            this.store.dispatch(retrievedMapSelection({ data: true }));
          })
        }
      })
    })
  }

  randomizeIpInterfaces(listInterfaces: any[]) {
    this.checkIpAlocation(listInterfaces);
    let pks;
    if (this.interfacePks.length > 0) {
      pks = this.interfacePks
      this.interfaceService.randomizeIpBulk({ pks }).pipe(
        catchError((error: any) => {
          this.toastr.error(error.error.message);
          return throwError(() => error.error.message);
        })
      ).subscribe(response => {
        const data = response.result;
        data.map((ele: any) => {
          const element = this.cy.getElementById(ele.id);
          const ip_str = ele.ip ? ele.ip : "";
          const ip = ip_str.split(".");
          const last_octet = ip.length == 4 ? "." + ip[3] : "";
          element.data('ip', ip_str);
          element.data('ip_last_octet', last_octet);
          this.nodeService.get(ele.node_id).subscribe(nodeData => {
            this.helpersService.updateNodesStorage(nodeData.result);
            this.helpersService.updateNodeOnMap(this.cy, 'node-' + nodeData.result.id, nodeData.result);
          });
        });
        response.message.map((message: string) => {
          this.toastr.success(message);
        });
        this.store.dispatch(retrievedMapSelection({ data: true }));
      });
    }
  }

  checkIpAlocation(data: any[]) {
    this.interfacePks = []
    data.forEach((val: any) => {
      if (val.ip_allocation === 'static_manual') {
        this.toastr.warning(`Interface ${val.name}'s IP address of “static_manual” interfaces cannot be randomized.`)
      } else {
        const id = val.interface_pk ? val.interface_pk : val.id
        if (id) {
          this.interfacePks.push(id)
        }
      }
    });
  }
}
