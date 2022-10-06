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
import { AddNodeDeployDialogComponent } from './add-node-deploy-dialog/add-node-deploy-dialog.component';
import { CreateNodeSnapshotDialogComponent } from './create-node-snapshot-dialog/create-node-snapshot-dialog.component';
import { DeleteNodeSnapshotDialogComponent } from './delete-node-snapshot-dialog copy/delete-node-snapshot-dialog.component';
import { InfoPanelNodeComponent } from './info-panel/info-panel-node/info-panel-node.component';
import { InfoPanelPortGroupComponent } from './info-panel/info-panel-port-group/info-panel-port-group.component';
import { InfoPanelInterfaceComponent } from './info-panel/info-panel-interface/info-panel-interface.component';
import { InfoPanelRenderComponent } from './info-panel/info-panel-render/info-panel-render.component';
import { InfoPanelDomainComponent } from './info-panel/info-panel-domain/info-panel-domain.component';
import { AddUpdateDomainDialogComponent } from './add-update-domain-dialog/add-update-domain-dialog.component';
import { InfoPanelGroupComponent } from './info-panel/info-panel-group/info-panel-group.component';
import { AddUpdateGroupDialogComponent } from './add-update-group-dialog/add-update-group-dialog.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { NodeBulkEditDialogComponent } from './bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component';
import { PortGroupBulkEditDialogComponent } from './bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component';
import { InterfaceBulkEditDialogComponent } from "./bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { ToolPanelRemoteComponent } from './tool-panel/tool-panel-remote/tool-panel-remote.component';
import { ServerConnectDialogComponent } from './tool-panel/tool-panel-remote/server-connect-dialog/server-connect-dialog.component';


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
    AddNodeDeployDialogComponent,
    CreateNodeSnapshotDialogComponent,
    DeleteNodeSnapshotDialogComponent,
    InfoPanelNodeComponent,
    InfoPanelPortGroupComponent,
    InfoPanelInterfaceComponent,
    InfoPanelRenderComponent,
    InfoPanelDomainComponent,
    AddUpdateDomainDialogComponent,
    InfoPanelGroupComponent,
    AddUpdateGroupDialogComponent,
    NodeBulkEditDialogComponent,
    PortGroupBulkEditDialogComponent,
    InterfaceBulkEditDialogComponent,
    ToolPanelRemoteComponent,
    ServerConnectDialogComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule,
    NgSelectModule,
  ]
})
export class MapModule { }
