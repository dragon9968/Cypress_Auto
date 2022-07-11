import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { GuardsModule } from '../auth/guards/guards.module';
import { StorageModule } from '../storage/storage.module';
import { ProjectActionsRenderer } from './components/renderers/project-actions-renderer.component';
import { BaseDialogComponent } from './dialogs/base/base-dialog.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';


const materialModules = [
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
  MatSelectModule,
  MatRadioModule,
  MatIconModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatSliderModule,
  MatCardModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatListModule,
  MatTabsModule,
  MatExpansionModule
];

@NgModule({
  declarations: [
    BaseDialogComponent,
    NavBarComponent,
    ProjectActionsRenderer
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    GuardsModule,
    StorageModule,
    AgGridModule,
    ...materialModules
  ],
  exports: [
    CommonModule,
    BaseDialogComponent,
    NavBarComponent,
    AgGridModule,
    GuardsModule,
    StorageModule,
    ...materialModules
  ],
})
export class SharedModule {}
