import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { AppPreferencesComponent } from './app-preferences/app-preferences.component';
import { MapPreferencesComponent } from './map-preferences/map-preferences.component';


@NgModule({
  declarations: [
    AppPreferencesComponent,
    MapPreferencesComponent
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
