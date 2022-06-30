import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BaseDialogComponent } from './dialogs/base/base-dialog.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@NgModule({
  declarations: [
    BaseDialogComponent,
    NavBarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    BaseDialogComponent,
    NavBarComponent,
    NavBarComponent,
  ],
})
export class SharedModule {}
