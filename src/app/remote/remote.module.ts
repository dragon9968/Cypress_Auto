import { NgModule } from '@angular/core';
import { RemoteRoutingModule } from './remote-routing.module';
import { ConnectComponent } from './connect/connect.component';
import { ConnectionProfilesComponent } from './connection-profiles/connection-profiles.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ConnectComponent,
    ConnectionProfilesComponent
  ],
  imports: [
    SharedModule,
    RemoteRoutingModule
  ]
})
export class RemoteModule { }
