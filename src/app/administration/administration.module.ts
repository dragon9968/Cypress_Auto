import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { UsersComponent } from './users/users.component';
import { SharedModule } from '../shared/shared.module';
import { AddEditUserDialogComponent } from './users/add-edit-user-dialog/add-edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './users/reset-password-dialog/reset-password-dialog.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddEditUserDialogComponent,
    ResetPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdministrationRoutingModule
  ]
})
export class AdministrationModule { }
