import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapRoutingModule } from './map-routing.module';



@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    MapRoutingModule,
    SharedModule
  ]
})
export class MapModule { }
