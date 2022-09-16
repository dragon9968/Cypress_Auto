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
    InfoPanelRenderComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
