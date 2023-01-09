import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { ToolPanelComponent } from './tool-panel/tool-panel.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { ToolPanelEditComponent } from './tool-panel/tool-panel-edit/tool-panel-edit.component';
import { ToolPanelStyleComponent } from './tool-panel/tool-panel-style/tool-panel-style.component';
import { ToolPanelOptionComponent } from './tool-panel/tool-panel-option/tool-panel-option.component';
import { AddUpdateNodeDialogComponent } from './add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdatePGDialogComponent } from './add-update-pg-dialog/add-update-pg-dialog.component';
import { AddUpdateInterfaceDialogComponent } from './add-update-interface-dialog/add-update-interface-dialog.component';
import { AddUpdateNodeDeployDialogComponent } from './deployment-dialog/deployment-node-dialog/add-update-node-deploy-dialog/add-update-node-deploy-dialog.component';
import { CreateNodeSnapshotDialogComponent } from './deployment-dialog/deployment-node-dialog/create-node-snapshot-dialog/create-node-snapshot-dialog.component';
import { DeleteNodeSnapshotDialogComponent } from './deployment-dialog/deployment-node-dialog/delete-node-snapshot-dialog/delete-node-snapshot-dialog.component';
import { InfoPanelNodeComponent } from './info-panel/info-panel-node/info-panel-node.component';
import { InfoPanelPortGroupComponent } from './info-panel/info-panel-port-group/info-panel-port-group.component';
import { InfoPanelInterfaceComponent } from './info-panel/info-panel-interface/info-panel-interface.component';
import { InfoPanelDomainComponent } from './info-panel/info-panel-domain/info-panel-domain.component';
import { AddUpdateDomainDialogComponent } from './add-update-domain-dialog/add-update-domain-dialog.component';
import { InfoPanelGroupComponent } from './info-panel/info-panel-group/info-panel-group.component';
import { AddUpdateGroupDialogComponent } from './add-update-group-dialog/add-update-group-dialog.component';
import { NodeBulkEditDialogComponent } from './bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component';
import { PortGroupBulkEditDialogComponent } from './bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component';
import { InterfaceBulkEditDialogComponent } from "./bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { ToolPanelRemoteComponent } from './tool-panel/tool-panel-remote/tool-panel-remote.component';
import { ServerConnectDialogComponent } from './tool-panel/tool-panel-remote/server-connect-dialog/server-connect-dialog.component';
import { DomainBulkEditDialogComponent } from './bulk-edit-dialog/domain-bulk-edit-dialog/domain-bulk-edit-dialog.component';
import { AddDomainUserDialogComponent } from './info-panel/info-panel-domain/add-domain-user-dialog/add-domain-user-dialog.component';
import { InfoPanelTaskComponent } from './info-panel/info-panel-task/info-panel-task.component';
import { ShowUserTaskDialogComponent } from './info-panel/info-panel-task/show-user-task-dialog/show-user-task-dialog.component';
import { RevertNodeSnapshotDialogComponent } from './deployment-dialog/deployment-node-dialog/revert-node-snapshot-dialog/revert-node-snapshot-dialog.component';
import { DeleteNodeDeployDialogComponent } from './deployment-dialog/deployment-node-dialog/delete-node-deploy-dialog/delete-node-deploy-dialog.component';
import { DomainUserDialogComponent } from './info-panel/info-panel-domain/domain-user-dialog/domain-user-dialog.component';
import { UpdateDomainUserDialogComponent } from './info-panel/info-panel-domain/update-domain-user-dialog/update-domain-user-dialog.component';
import { AddDeletePGDeployDialogComponent } from './deployment-dialog/deployment-pg-dialog/add-delete-pg-deploy-dialog/add-delete-pg-deploy-dialog.component';
import { UpdateFactsNodeDialogComponent } from './deployment-dialog/deployment-node-dialog/update-facts-node-dialog/update-facts-node-dialog.component';
import { InfoPanelShowValidationNodesComponent } from './info-panel/info-panel-show-validation-nodes/info-panel-show-validation-nodes.component';
import { InfoPanelPortGroupManagementComponent } from './info-panel/info-panel-port-group-management/info-panel-port-group-management.component';
import { InfoPanelInterfaceManagementComponent } from './info-panel/info-panel-interface-management/info-panel-interface-management.component';
import { NodeToolsDialogComponent } from './deployment-dialog/deployment-node-dialog/node-tools-dialog/node-tools-dialog.component';


@NgModule({
  declarations: [
    MapComponent,
    ToolPanelComponent,
    InfoPanelComponent,
    ToolPanelEditComponent,
    ToolPanelStyleComponent,
    ToolPanelOptionComponent,
    AddUpdateNodeDialogComponent,
    AddUpdatePGDialogComponent,
    AddUpdateInterfaceDialogComponent,
    AddUpdateNodeDeployDialogComponent,
    CreateNodeSnapshotDialogComponent,
    DeleteNodeSnapshotDialogComponent,
    InfoPanelNodeComponent,
    InfoPanelPortGroupComponent,
    InfoPanelInterfaceComponent,
    InfoPanelDomainComponent,
    AddUpdateDomainDialogComponent,
    InfoPanelGroupComponent,
    AddUpdateGroupDialogComponent,
    NodeBulkEditDialogComponent,
    PortGroupBulkEditDialogComponent,
    InterfaceBulkEditDialogComponent,
    ToolPanelRemoteComponent,
    ServerConnectDialogComponent,
    DomainBulkEditDialogComponent,
    AddDomainUserDialogComponent,
    InfoPanelTaskComponent,
    ShowUserTaskDialogComponent,
    RevertNodeSnapshotDialogComponent,
    DeleteNodeDeployDialogComponent,
    DomainUserDialogComponent,
    UpdateDomainUserDialogComponent,
    AddDeletePGDeployDialogComponent,
    UpdateFactsNodeDialogComponent,
    InfoPanelShowValidationNodesComponent,
    InfoPanelPortGroupManagementComponent,
    InfoPanelInterfaceManagementComponent,
    NodeToolsDialogComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule,
  ]
})
export class MapModule { }
