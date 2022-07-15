import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { EditorComponent } from './editor/editor.component';
import { ToolPanelComponent } from './tool-panel/tool-panel.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { ToolPanelEditComponent } from './tool-panel-edit/tool-panel-edit.component';
import { ToolPanelStyleComponent } from './tool-panel-style/tool-panel-style.component';
import { ToolPanelOptionComponent } from './tool-panel-option/tool-panel-option.component';



@NgModule({
  declarations: [
    MapComponent,
    EditorComponent,
    ToolPanelComponent,
    InfoPanelComponent,
    ToolPanelEditComponent,
    ToolPanelStyleComponent,
    ToolPanelOptionComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
