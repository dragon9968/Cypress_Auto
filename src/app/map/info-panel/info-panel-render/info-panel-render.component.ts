import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { NodeService } from "../../../core/services/node/node.service";
import { GroupService } from "../../../core/services/group/group.service";
import { DomainService } from "../../../core/services/domain/domain.service";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { UserTaskService } from "../../../core/services/user-task/user-task.service";
import { PortGroupService } from "../../../core/services/portgroup/portgroup.service";
import { InterfaceService } from "../../../core/services/interface/interface.service";
import { InfoPanelService } from "../../../core/services/info-panel/info-panel.service";
import { DomainUserService } from "../../../core/services/domain-user/domain-user.service";
import { CMViewDetailsService } from "../../context-menu/cm-view-details/cm-view-details.service";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { ShowUserTaskDialogComponent } from "../info-panel-task/show-user-task-dialog/show-user-task-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";
import { selectDomainUsers } from "../../../store/domain-user/domain-user.selectors";
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
  userTaskId: any;
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
    private infoPanelService: InfoPanelService,
    private userTaskService: UserTaskService
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
    } else if (this.userTaskId) {
      this.userTaskService.getById(this.userTaskId).subscribe(userTaskData => {
        const dialogData = {
          mode: 'postTask',
          genData: userTaskData.result
        }
        this.dialog.open(ShowUserTaskDialogComponent, {width: `${screen.width}px`, data: dialogData})
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
        this.infoPanelService.deleteDomain(domainData.result, this.collectionId);
      });
    } else if (this.group_id) {
      this.groupService.get(this.group_id).subscribe(groupData => {
        this._deleteGroup(groupData.result);
      })
    } else if (this.userTaskId){
      const dialogData = {
        title: 'User confirmation needed',
        message: 'You sure you want to delete this item?',
        submitButtonName: 'OK'
      }
      const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
      dialogConfirm.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.infoPanelService.deleteUserTask(this.userTaskId);
        }
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
    } else if (this.tabName == 'userTask') {
      this.userTaskId = this.id
    }
  }

  private _deleteGroup(group: any) {
    this.groupService.delete(group.id).subscribe(response => this.toastr.success('Deleted Row'));
    this.groupService.getGroupByCollectionId(this.collectionId).subscribe(data => {
      this.store.dispatch(retrievedGroups({data: data.result}));
    })
  }
}
