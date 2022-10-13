import { NgModule } from '@angular/core';
import { RemoteRoutingModule } from './remote-routing.module';
import { ConnectComponent } from './connect/connect.component';
import { ConnectionProfilesComponent } from './connection-profiles/connection-profiles.component';
import { SharedModule } from '../shared/shared.module';
import { ConnectionActionsRendererComponent } from './renderers/connection-actions-renderer.component';
import { AddEditConnectionProfilesComponent } from './add-edit-connection-profiles/add-edit-connection-profiles.component';
import { ShowConnectionProfilesComponent } from './show-connection-profiles/show-connection-profiles.component';


@NgModule({
  declarations: [
    ConnectComponent,
    ConnectionProfilesComponent,
    ConnectionActionsRendererComponent,
    AddEditConnectionProfilesComponent,
    ShowConnectionProfilesComponent
  ],
  imports: [
    SharedModule,
    RemoteRoutingModule
  ]
})
export class RemoteModule { }
