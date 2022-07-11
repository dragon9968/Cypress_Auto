import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapEditorComponent } from './editor/map-editor.component';
import { MapToolPanelComponent } from './tool-panel/map-tool-panel.component';
import { MapInfoPanelComponent } from './info-panel/map-info-panel.component';



@NgModule({
  declarations: [
    MapComponent,
    MapEditorComponent,
    MapToolPanelComponent,
    MapInfoPanelComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
