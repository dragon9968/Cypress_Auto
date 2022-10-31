import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { AppPreferencesComponent } from './app-preferences/app-preferences.component';
import { MapPreferencesComponent } from './map-preferences/map-preferences.component';
import { ActionsRenderMappreComponent } from './map-preferences/actions-render-mappre/actions-render-mappre.component';
import { AddEditMapprefDialogComponent } from './map-preferences/add-edit-mappref-dialog/add-edit-mappref-dialog.component';


@NgModule({
  declarations: [
    AppPreferencesComponent,
    MapPreferencesComponent,
    ActionsRenderMappreComponent,
    AddEditMapprefDialogComponent
  ],
  imports: [
    SharedModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }
