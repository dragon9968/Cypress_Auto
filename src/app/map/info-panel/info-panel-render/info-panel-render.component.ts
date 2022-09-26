import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { ToastrService } from "ngx-toastr";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { NodeService } from "../../../core/services/node/node.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { DomainUserService } from "../../../core/services/domain-user/domain-user.service";
import { DomainService } from "../../../core/services/domain/domain.service";
import { CMViewDetailsService } from "../../context-menu/cm-view-details/cm-view-details.service";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
import { retrievedPortGroups } from "../../../store/portgroup/portgroup.actions";
import { retrievedNode } from "../../../store/node/node.actions";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { retrievedDomainUsers } from "../../../store/domain-user/domain-user.actions";

@Component({
  selector: 'app-info-panel-render',
  templateUrl: './info-panel-render.component.html',
  styleUrls: ['./info-panel-render.component.scss']
})
export class InfoPanelRenderComponent implements ICellRendererAngularComp, OnInit {
  id: any;
  node_id: any;
  interface_id: any;
  pg_id: any;
  domain_id: any;
  collectionId: any;
  getExternalParams: (() => any) | any;
  selectMapOption$ = new Subscription();
  selectPortGroups$ = new Subscription();
  selectNode$ = new Subscription();
  selectDomainUser$ = new Subscription();
  isGroupBoxesChecked!: boolean;
  tabName?: string;
  portGroups!: any[];
  nodes!: any[];
  domain!: any;
  domainUsers!: any[];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
    private domainService: DomainService,
    private domainUserService: DomainUserService,
    private cmViewDetailsService: CMViewDetailsService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectPortGroups$ = this.store.select(selectPortGroups).subscribe((portGroups: any) => this.portGroups = portGroups);
    this.selectNode$ = this.store.select(selectNodesByCollectionId).subscribe((nodeData: any) => this.nodes = nodeData);
    this.selectDomainUser$ = this.store.select(selectDomainUsers).subscribe(domainUserData => this.domainUsers = domainUserData);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.portGroupService.getByCollectionId(this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedPortGroups({data: data.result}))
    );
    this.nodeService.getNodesByCollectionId(this.collectionId).subscribe(
      (data: any) => this.store.dispatch(retrievedNode({data: data.result}))
    );
    this.selectDomainUser$ = this.domainUserService.getAll().subscribe(
      data => this.store.dispatch(retrievedDomainUsers({data: data.result}))
    );
  }

  agInit(params: ICellRendererParams): void {
    this.getExternalParams = (params as any).getExternalParams;
    this.tabName = (params as any).tabName;
    this.id = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  viewInfoPanel(event: any) {
    this._setDataBasedOnTab();
    if (this.domain_id) {
      this.domainService.get(this.domain_id).subscribe(domainData => {
        const dialogData = {
          mode: 'view',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', data: dialogData});
      })
    } else {
      this._setDataGetter(event);
      this.cmViewDetailsService.openViewDetailForm(event);
    }
  }

  editInfoPanel() {
    this._setDataBasedOnTab();
    if (this.pg_id) {
      this.portGroupService.get(this.pg_id).subscribe(pgData => {
        const dialogData = {
          mode: 'update',
          genData: pgData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdatePGDialogComponent, {width: '600px', data: dialogData});
      });
    } else if (this.node_id) {
      this.nodeService.get(this.node_id).subscribe(nodeData => {
        const dialogData = {
          mode: 'update',
          genData: nodeData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', data: dialogData});
      });
    } else if (this.interface_id) {
      this.interfaceService.get(this.interface_id).subscribe(interfaceData => {
        const dialogData = {
          mode: 'update',
          genData: interfaceData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdateInterfaceDialogComponent, {width: '600px', data: dialogData});
      })
    } else if (this.domain_id) {
      this.domainService.get(this.domain_id).subscribe(domainData => {
        const dialogData = {
          mode: 'update',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', data: dialogData});
      })
    }
  }

  deleteInfoPanel() {
    this._setDataBasedOnTab();
    const params = this.getExternalParams();
    if (this.domain_id) {
      this.domainService.get(this.domain_id).subscribe(domainData => {
        this._deleteDomain(domainData.result);
      });
    } else {
      this.delete(params.cy, params.activeNodes, params.activePGs, params.activeEdges,
        params.activeGBs, params.deletedNodes, params.deletedInterfaces);
    }
  }

  private _setDataGetter(event: any) {
    event.target.data = () => ({
      node_id: this.node_id,
      interface_id: this.interface_id,
      pg_id: this.pg_id
    });
  }

  private _setDataBasedOnTab() {
    if (this.tabName == 'node') {
      this.node_id = this.id;
    } else if (this.tabName == 'portGroup') {
      this.pg_id = this.id;
    } else if (this.tabName == 'edge') {
      this.interface_id = this.id;
    } else if (this.tabName == 'domain') {
      this.domain_id = this.id;
    }
  }

  delete(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
         deletedNodes: any[], deletedInterfaces: any[]) {
    let idName = '';
    let id = '';
    if (this.tabName == 'node') {
      idName = 'node_id';
      id = this.id;
    } else if (this.tabName == 'portGroup') {
      idName = 'pg_id';
      id = this.id;
    } else if (this.tabName == 'edge') {
      idName = 'interface_id';
      id = this.id;
    }

    activeEdges.filter(ele => ele.data(idName) === id).forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.helpers.removeEdge(edge, deletedInterfaces);
        const index = activeEdges.findIndex(ele => ele.data(idName) === id);
        activeEdges.splice(index, 1);
        // TODO: this.tool_panel.update_components();
      }
    });

    activeNodes.concat(activePGs, activeGBs)
      .filter(ele => ele.data(idName) === id)
      .forEach((node: any) => {
        // Remove the interface is connecting to the Port Group or Node
        const interfacesDeleted = this._getEdgesConnectingToNode(node);
        for (let i = 0; i < activeEdges.length; i++) {
          const data = activeEdges[i].data();
          if (interfacesDeleted.includes(data.interface_id)) {
            activeEdges.splice(i, 1);
            i--;
          }
        }

        this.helpers.removeNode(node, deletedNodes, deletedInterfaces);
        if (this.isGroupBoxesChecked) {
          cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
            if (gb.children().length == 0) {
              this.helpers.removeNode(gb, deletedNodes, deletedInterfaces);
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

  private _getEdgesConnectingToNode(node: any) {
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

  private _deleteDomain(domain: any) {
    const isDomainInNode = this.nodes.some(ele => ele.domain_id === domain.id);
    const isDomainInPG = this.portGroups.some(ele => ele.domain_id === domain.id);
    const domainName = domain.name;
    if (isDomainInNode && isDomainInPG) {
      this.toastr.error(`Port groups and nodes are still associated with domain ${ domainName }`);
    } else if (isDomainInNode) {
      this.toastr.error(`Nodes are still associated with this domain ${ domainName }`);
    } else if (isDomainInPG) {
      this.toastr.error(`Port groups are still associated with domain ${ domainName }`)
    } else {
      this.domainUsers
        .filter(ele => ele.domain_id === domain.id)
        .map(ele => {
          return this.domainUserService.delete(ele.id).subscribe(response => {
            this.toastr.success(`Deleted domain user ${ ele.username }`);
          })
        });
      this.domainService.delete(domain.id).subscribe(response => {
        this.toastr.success(`Deleted domain ${ domainName }`);
        this.domainService.getDomainByCollectionId(this.collectionId).subscribe(
          (data: any) => this.store.dispatch(retrievedDomains({data: data.result}))
        );
      })
    }
  }
}
