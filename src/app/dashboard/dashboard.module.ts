import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { NetworkMapComponent } from './network-map/network-map.component';
import { ProjectDetailComponent } from "./project-detail/project-detail.component";

@NgModule({
  declarations: [
    DashboardComponent,
    NetworkMapComponent,
    ProjectDetailComponent
  ],
  imports: [
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
