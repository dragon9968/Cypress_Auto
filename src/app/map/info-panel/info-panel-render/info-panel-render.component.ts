import { Store } from "@ngrx/store";
import { MatDialog } from "@angular/material/dialog";
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
import { DomainUserDialogComponent } from "../info-panel-domain/domain-user-dialog/domain-user-dialog.component";
import { AddUpdatePGDialogComponent } from "../../add-update-pg-dialog/add-update-pg-dialog.component";
import { ShowUserTaskDialogComponent } from "../info-panel-task/show-user-task-dialog/show-user-task-dialog.component";
import { ConfirmationDialogComponent } from "../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdateGroupDialogComponent } from "../../add-update-group-dialog/add-update-group-dialog.component";
import { AddUpdateDomainDialogComponent } from "../../add-update-domain-dialog/add-update-domain-dialog.component";
import { UpdateDomainUserDialogComponent } from "../info-panel-domain/update-domain-user-dialog/update-domain-user-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../add-update-interface-dialog/add-update-interface-dialog.component";
import { retrievedMapSelection } from "../../../store/map-selection/map-selection.actions";

@Component({
  selector: 'app-info-panel-render',
  templateUrl: './info-panel-render.component.html',
  styleUrls: ['./info-panel-render.component.scss']
})
export class InfoPanelRenderComponent implements ICellRendererAngularComp, OnInit {
  id: any;
  nodeId: any;
  interfaceId: any;
  pgId: any;
  domainId: any;
  groupId: any;
  userTaskId: any;
  domainUserId: any;
  collectionId: any;
  getExternalParams: (() => any) | any;
  tabName!: string;

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
  }

  ngOnInit(): void {
  }

  agInit(params: ICellRendererParams): void {
    this.getExternalParams = (params as any).getExternalParams;
    this.tabName = (params as any).tabName;
    this.id = params.value;
    this.collectionId = this.getExternalParams().collectionId;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  viewInfoPanel() {
    this._setDataBasedOnTab();
    if (this.domainId) {
      this.domainService.get(this.domainId).subscribe(domainData => {
        const dialogData = {
          mode: 'view',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      })
    } else if (this.groupId) {
      this.groupService.get(this.groupId).subscribe(groupData => {
        const dialogData = {
          mode: 'view',
          genData: groupData.result,
          collection_id: groupData.result.collection_id,
          map_category: 'logical'
        };
        this.dialog.open(AddUpdateGroupDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      })
    } else if (this.userTaskId) {
      this.userTaskService.get(this.userTaskId).subscribe(userTaskData => {
        const dialogData = {
          mode: 'postTask',
          genData: userTaskData.result
        }
        this.dialog.open(ShowUserTaskDialogComponent, {width: `${screen.width}px`, autoFocus: false, data: dialogData})
      })
    } else if (this.interfaceId) {
      this.interfaceService.get(this.interfaceId).subscribe(interfaceData => {
        const dialogData = {
          mode: 'view',
          genData: interfaceData.result,
        }
        this.dialog.open(AddUpdateInterfaceDialogComponent, {width: '600px', data: dialogData});
      });
    } else if (this.pgId) {
      this.portGroupService.get(this.pgId).subscribe(pgData => {
        const dialogData = {
          mode: 'view',
          genData: pgData.result,
        }
        this.dialog.open(AddUpdatePGDialogComponent, {width: '600px', data: dialogData});
      });
    } else if (this.nodeId) {
      this.nodeService.get(this.nodeId).subscribe(nodeData => {
        const dialogData = {
          mode: 'view',
          genData: nodeData.result,
        }
        this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', data: dialogData});
      });
    }
  }

  editInfoPanel() {
    this._setDataBasedOnTab();
    if (this.pgId) {
      this.portGroupService.get(this.pgId).subscribe(pgData => {
        const dialogData = {
          mode: 'update',
          genData: pgData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdatePGDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      });
    } else if (this.nodeId) {
      this.nodeService.get(this.nodeId).subscribe(nodeData => {
        const dialogData = {
          mode: 'update',
          genData: nodeData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      });
    } else if (this.interfaceId) {
      this.interfaceService.get(this.interfaceId).subscribe(interfaceData => {
        const dialogData = {
          mode: 'update',
          genData: interfaceData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdateInterfaceDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      })
    } else if (this.domainId) {
      this.domainService.get(this.domainId).subscribe(domainData => {
        const dialogData = {
          mode: 'update',
          genData: domainData.result
        };
        this.dialog.open(AddUpdateDomainDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      })
    } else if (this.groupId) {
      this.groupService.get(this.groupId).subscribe(groupData => {
          const dialogData = {
            mode: 'update',
            genData: groupData.result,
            collection_id: groupData.result.collection_id,
            map_category: 'logical'
          };
          this.dialog.open(AddUpdateGroupDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
        }
      )
    } else if (this.domainUserId) {
        this.domainUserService.get(this.domainUserId).subscribe(domainUserData => {
          this.domainService.get(domainUserData.result.domain_id).subscribe(domainData => {
            const dialogData = {
              genData: domainUserData.result,
              domain: domainData.result
            };
            this.dialog.open(UpdateDomainUserDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
          }
        )
      })
    }
  }

  deleteInfoPanel() {
    this._setDataBasedOnTab();
    const params = this.getExternalParams();
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
    dialogConfirm.afterClosed().subscribe(confirm => {
      if (confirm) {
        if (this.domainId) {
          this.domainService.get(this.domainId).subscribe(domainData => {
            this.infoPanelService.deleteDomain(domainData.result, this.collectionId);
          });
        } else if (this.groupId) {
          this.groupService.get(this.groupId).subscribe(groupData => {
            this.infoPanelService.deleteGroup(groupData.result, this.collectionId);
          })
        } else if (this.userTaskId) {
          this.infoPanelService.deleteUserTask(this.userTaskId);
        } else if (this.domainUserId) {
          this.infoPanelService.deleteDomainUser(this.domainUserId);
        } else {
          this.infoPanelService.delete(params.cy, params.activeNodes, params.activePGs, params.activeEdges,
            params.activeGBs, params.deletedNodes, params.deletedInterfaces, this.tabName, this.id);
        }
        this.store.dispatch(retrievedMapSelection({ data: true }));
      }
    })
  }

  private _setDataBasedOnTab() {
    if (this.tabName == 'node') {
      this.nodeId = this.id;
    } else if (this.tabName == 'portGroup') {
      this.pgId = this.id;
    } else if (this.tabName == 'edge') {
      this.interfaceId = this.id;
    } else if (this.tabName == 'domain') {
      this.domainId = this.id;
    } else if (this.tabName == 'group') {
      this.groupId = this.id;
    } else if (this.tabName == 'userTask') {
      this.userTaskId = this.id
    } else if (this.tabName == 'domainUser') {
      this.domainUserId = this.id
    }
  }

  openDomainUsers() {
    this._setDataBasedOnTab();
    this.domainService.get(this.domainId).subscribe( domainResponse => {
      this.domainUserService.getDomainUserByDomainId(this.domainId).subscribe(data => {
        const dialogData = {
          genData: data.result,
          domain: domainResponse.result
        }
        this.dialog.open(DomainUserDialogComponent,
          {width: `${screen.width}px`, height: `${screen.height*.7}px`, data: dialogData});
      })
    })
  }
}
