import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TemplatesRoutingModule } from './templates-routing.module';
import { ConfigTemplatesComponent } from './config-templates/config-templates.component';
import { NetworkTemplatesComponent } from './network-templates/network-templates.component';


@NgModule({
  declarations: [
    ConfigTemplatesComponent,
    NetworkTemplatesComponent
  ],
  imports: [
    SharedModule,
    TemplatesRoutingModule
  ]
})
export class TemplatesModule { }
