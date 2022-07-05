import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { ProjectActionsRenderer } from './components/renderers/project-actions-renderer.component';
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
    AgGridModule.withComponents([ProjectActionsRenderer])
  ],
  exports: [
    CommonModule,
    BaseDialogComponent,
    NavBarComponent,
    AgGridModule
  ],
})
export class SharedModule {}
