import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditUserDialogComponent } from './users/add-edit-user-dialog/add-edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './users/reset-password-dialog/reset-password-dialog.component';
import { RolesComponent } from './roles/roles.component';
import { AddEditRoleDialogComponent } from './roles/add-edit-role-dialog/add-edit-role-dialog.component';
import { ExportRoleDialogComponent } from './roles/export-role-dialog/export-role-dialog.component';
import { ImportRoleDialogComponent } from './roles/import-role-dialog/import-role-dialog.component';
import { CloneRoleDialogComponent } from './roles/clone-role-dialog/clone-role-dialog.component';
import { ActionRenderersComponent } from './action-renderers/action-renderers.component';
import { LDAPConfigurationComponent } from './ldap-configuration/ldap-configuration.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddEditUserDialogComponent,
    ResetPasswordDialogComponent,
    RolesComponent,
    AddEditRoleDialogComponent,
    ExportRoleDialogComponent,
    ImportRoleDialogComponent,
    CloneRoleDialogComponent,
    ActionRenderersComponent,
    LDAPConfigurationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdministrationRoutingModule
  ]
})
export class AdministrationModule { }
