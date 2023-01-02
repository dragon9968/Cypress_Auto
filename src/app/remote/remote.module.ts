import { NgModule } from '@angular/core';
import { RemoteRoutingModule } from './remote-routing.module';
import { ConnectComponent } from './connect/connect.component';
import { ConnectionProfilesComponent } from './connection-profiles/connection-profiles.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditConnectionProfilesComponent } from './connection-profiles/add-edit-connection-profiles/add-edit-connection-profiles.component';
import { ConnectionActionsRendererComponent } from './renderers/connection-actions/connection-actions-renderer.component';
import { ConnectionStatusRendererComponent } from './renderers/connection-status/connection-status-renderer.component';


@NgModule({
  declarations: [
    ConnectComponent,
    ConnectionProfilesComponent,
    ConnectionActionsRendererComponent,
    AddEditConnectionProfilesComponent,
    ConnectionStatusRendererComponent
  ],
  imports: [
    SharedModule,
    RemoteRoutingModule
  ]
})
export class RemoteModule { }
