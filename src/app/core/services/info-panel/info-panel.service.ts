import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Subscription, throwError } from "rxjs";
import { Injectable, Input, OnDestroy } from '@angular/core';
import { MapService } from "../map/map.service";
import { ProjectService } from "../../../project/services/project.service";
import { UserTaskService } from "../user-task/user-task.service";
import { PortGroupService } from "../portgroup/portgroup.service";
import { InterfaceService } from "../interface/interface.service";
import { DomainUserService } from "../domain-user/domain-user.service";
import { ServerConnectService } from "../server-connect/server-connect.service";
import { selectVMStatus } from "../../../store/project/project.selectors";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { deleteDomains } from "../../../store/domain/domain.actions";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
import { selectLogicalNodes, selectSelectedLogicalNodes } from "../../../store/node/node.selectors";
import { retrievedIsChangeDomainUsers } from "../../../store/domain-user-change/domain-user-change.actions";
import { selectMapPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { retrievedIsHypervisorConnect } from "src/app/store/server-connect/server-connect.actions";
import { retrievedVMStatus } from "src/app/store/project/project.actions";
import { RemoteCategories } from "../../enums/remote-categories.enum";
import { PortGroupRandomizeSubnetModel } from "../../models/port-group.model";
import { randomizeIpBulk } from "src/app/store/interface/interface.actions";
import { selectNetmasks } from "src/app/store/netmask/netmask.selectors";
import { selectDomains } from "src/app/store/domain/domain.selectors";
import { randomizeSubnetPortGroups } from "src/app/store/portgroup/portgroup.actions";

@Injectable({
  providedIn: 'root'
})
export class InfoPanelService implements OnDestroy {
  @Input() ur: any;
  @Input() cy: any;
  selectNode$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectMapPortGroups$ = new Subscription();
  selectDomains$ = new Subscription();
  selectDomainUser$ = new Subscription();
  selectVMStatus$ = new Subscription();
  selectNetmasks$ = new Subscription();
  selectSelectedLogicalNodes$ = new Subscription();
  nodes!: any[];
  selectedNodes!: any[];
  selectedNodeIds!: any[];
  portGroups!: any[];
  domains!: any[];
  domainUsers!: any[];
  netmasks!: any[];
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
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodes = selectedNodes;
        this.selectedNodeIds = selectedNodes.map(n => n.id);
      }
    });
    this.selectDomainUser$ = this.store.select(selectDomainUsers).subscribe(domainUsers => this.domainUsers = domainUsers);
    this.selectNode$ = this.store.select(selectLogicalNodes).subscribe(nodes => {
      if (nodes) {
        this.nodes = nodes;
      }
    });
    this.selectMapPortGroups$ = this.store.select(selectMapPortGroups).subscribe(portGroups => {
      if (portGroups) {
        this.portGroups = portGroups;
      }
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe(domains => {
      if (domains) {
        this.domains = domains;
      }
    });
    this.selectDomainUser$ = this.store.select(selectDomainUsers).subscribe(domainUsers => {
      if (domainUsers) {
        this.domainUsers = domainUsers;
      }
    });
    this.selectVMStatus$ = this.store.select(selectVMStatus).subscribe(vmStatus => this.vmStatus = vmStatus);
    this.selectNetmasks$ = this.store.select(selectNetmasks).subscribe((netmasks: any) => this.netmasks = netmasks);
  }

  ngOnDestroy(): void {
    this.selectNode$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectMapPortGroups$.unsubscribe();
    this.selectDomainUser$.unsubscribe();
    this.selectVMStatus$.unsubscribe();
    this.selectNetmasks$.unsubscribe();
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

  deleteDomains(ids: any[]= [], projectId: string) {
    let isError = false;
    ids.map(id => {
      const domain = this.domains.find(d => d.id == id);
      const domainName = domain.name;
      const isDomainInNode = this.nodes.some(ele => ele.domain_id == id);
      const isDomainInPG = this.portGroups.some(ele => ele.domain_id == id);
      if (isDomainInNode && isDomainInPG) {
        this.toastr.error(`Port groups and nodes are still associated with domain ${domainName}`);
        isError = true;
      } else if (isDomainInNode) {
        this.toastr.error(`Nodes are still associated with this domain ${domainName}`);
        isError = true;
      } else if (isDomainInPG) {
        this.toastr.error(`Port groups are still associated with domain ${domainName}`);
        isError = true;
      }
    });
    if (!isError) {
      this.store.dispatch(deleteDomains({ ids, projectId }));
    }
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

  randomizeSubnetPortGroups(pks: number[], projectId: number) {
    const jsonData: PortGroupRandomizeSubnetModel = {
      pks: pks,
      project_id: projectId
    }
    this.store.dispatch(randomizeSubnetPortGroups({
      pks: pks,
      data: jsonData
    }))
  }

  updateInterfaceIPBasedOnPGId(portGroupIds: any) {
    portGroupIds.map((portGroupId: any) => {
      this.interfaceService.getByPortGroup(portGroupId).subscribe(response => {
        const interfacePks = this.checkIpAllocation(response.result)
        if (interfacePks.length > 0) {
          this.store.dispatch(randomizeIpBulk({
            pks: interfacePks,
            netmasks: this.netmasks
          }))
        }
      })
    })
  }

  randomizeIpInterfaces(listInterfaces: any[]) {
    const interfacePks = this.checkIpAllocation(listInterfaces);
    let pks;
    if (interfacePks.length > 0) {
      pks = interfacePks
      this.store.dispatch(randomizeIpBulk({
        pks: pks,
        netmasks: this.netmasks
       }))
    }
  }

  checkIpAllocation(data: any[]) {
    const interfacePks: any = [];
    data.forEach((val: any) => {
      if (val.ip_allocation === 'static_manual') {
        this.toastr.warning(`Interface ${val.name}'s IP address of “static_manual” interfaces cannot be randomized.`)
      } else {
        if (val.id) {
          interfacePks.push(val.id)
        }
      }
    });
    return interfacePks
  }
}
