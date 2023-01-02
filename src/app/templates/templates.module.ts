import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { TemplatesRoutingModule } from './templates-routing.module';
import { ConfigTemplatesComponent } from './config-templates/config-templates.component';
import { NetworkTemplatesComponent } from './network-templates/network-templates.component';
import { ActionsRendersConfigTemplateComponent } from './config-templates/actions-renders-config-template/actions-renders-config-template.component';
import { AddEditConfigTemplateComponent } from './config-templates/add-edit-config-template/add-edit-config-template.component';
import { AddRouteDialogComponent } from './config-templates/add-route-dialog/add-route-dialog.component';
import { AddFirewallRuleDialogComponent } from './config-templates/add-firewall-rule-dialog/add-firewall-rule-dialog.component';
import { AddDomainMembershipDialogComponent } from './config-templates/add-domain-membership-dialog/add-domain-membership-dialog.component';
import { AddEditRolesServicesDialogComponent } from './config-templates/add-edit-roles-services-dialog/add-edit-roles-services-dialog.component';
import { ShowConfigTemplateDialogComponent } from './config-templates/show-config-template-dialog/show-config-template-dialog.component';


@NgModule({
  declarations: [
    ConfigTemplatesComponent,
    NetworkTemplatesComponent,
    ActionsRendersConfigTemplateComponent,
    AddEditConfigTemplateComponent,
    AddRouteDialogComponent,
    AddFirewallRuleDialogComponent,
    AddDomainMembershipDialogComponent,
    AddEditRolesServicesDialogComponent,
    ShowConfigTemplateDialogComponent
  ],
  imports: [
    SharedModule,
    TemplatesRoutingModule
  ]
})
export class TemplatesModule { }
