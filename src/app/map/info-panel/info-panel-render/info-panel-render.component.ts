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
import { GroupService } from "../../../core/services/group/group.service";
import { InfoPanelService } from "../../../core/services/helpers/info-panel.service";
import { CMViewDetailsService } from "../../context-menu/cm-view-details/cm-view-details.service";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
import { retrievedPortGroups } from "../../../store/portgroup/portgroup.actions";
import { retrievedNode } from "../../../store/node/node.actions";
import { retrievedDomains } from "../../../store/domain/domain.actions";
import { retrievedDomainUsers } from "../../../store/domain-user/domain-user.actions";
import { retrievedGroups } from "../../../store/group/group.actions";

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
  group_id: any;
  collectionId: any;
  getExternalParams: (() => any) | any;
  selectMapOption$ = new Subscription();
  selectPortGroups$ = new Subscription();
  selectNode$ = new Subscription();
  selectDomainUser$ = new Subscription();
  isGroupBoxesChecked!: boolean;
  tabName!: string;
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
    private groupService: GroupService,
    private cmViewDetailsService: CMViewDetailsService,
    private infoPanelService: InfoPanelService
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
    } else if (this.group_id) {
      this.groupService.get(this.group_id).subscribe(groupData => {
        const dialogData = {
          mode: 'view',
          genData: groupData.result
        };
        this.dialog.open(AddUpdateGroupDialogComponent, {width: '600px', data: dialogData});
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
    } else if (this.group_id) {
      this.groupService.get(this.group_id).subscribe(groupData => {
          const dialogData = {
            mode: 'update',
            genData: groupData.result
          };
          this.dialog.open(AddUpdateGroupDialogComponent, {width: '600px', data: dialogData});
        }
      )
    }
  }

  deleteInfoPanel() {
    this._setDataBasedOnTab();
    const params = this.getExternalParams();
    if (this.domain_id) {
      this.domainService.get(this.domain_id).subscribe(domainData => {
        this._deleteDomain(domainData.result);
      });
    } if (this.group_id) {
      this.groupService.get(this.group_id).subscribe(groupData => {
        this._deleteGroup(groupData.result);
      })
    } else {
      this.infoPanelService.delete(params.cy, params.activeNodes, params.activePGs, params.activeEdges,
        params.activeGBs, params.deletedNodes, params.deletedInterfaces, this.tabName, this.id);
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
    } else if (this.tabName == 'group') {
      this.group_id = this.id;
    }
  }

  private _deleteDomain(domain: any) {
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
          return this.domainUserService.delete(ele.id).subscribe(response => {
            this.toastr.success(`Deleted domain user ${ele.username}`);
          })
        });
      this.domainService.delete(domain.id).subscribe(response => {
        this.toastr.success(`Deleted domain ${domainName}`);
        this.domainService.getDomainByCollectionId(this.collectionId).subscribe(
          (data: any) => this.store.dispatch(retrievedDomains({data: data.result}))
        );
      })
    }
  }

  private _deleteGroup(group: any) {
    this.groupService.delete(group.id).subscribe(response => this.toastr.success('Deleted Row'));
    this.groupService.getGroupByCollectionId(this.collectionId).subscribe(data => {
      this.store.dispatch(retrievedGroups({data: data.result}));
    })
  }
}
