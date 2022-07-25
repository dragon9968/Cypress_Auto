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



@NgModule({
  declarations: [
    MapComponent,
    ToolPanelComponent,
    InfoPanelComponent,
    ToolPanelEditComponent,
    ToolPanelStyleComponent,
    ToolPanelOptionComponent,
    AddUpdateNodeDialogComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
