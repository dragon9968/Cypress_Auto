import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { ResizableModule } from "angular-resizable-element";
import { MatChipsModule } from '@angular/material/chips';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { MatPaginatorModule } from "@angular/material/paginator";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { NgxPermissionsModule } from "ngx-permissions";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { AceEditorModule } from "ng2-ace-editor";
import { InfoPanelShowValidationResultsComponent } from './components/info-panel-show-validation-results/info-panel-show-validation-results.component';
import { SetAttributeDirective } from './directive/set-attribute.directive';
import { InfoPanelTableComponent } from './components/info-panel-table/info-panel-table.component';
import { ImportDialogComponent } from './components/import-dialog/import-dialog.component';


const materialModules = [
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatButtonModule,
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
  MatExpansionModule,
  MatMenuModule,
  MatAutocompleteModule,
  MatSelectModule,
  MatGridListModule,
  MatChipsModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  DragDropModule,
  MatButtonToggleModule,
  FlexLayoutModule,
  AngularDualListBoxModule
];

@NgModule({
  declarations: [ConfirmationDialogComponent, SpinnerComponent, InfoPanelShowValidationResultsComponent, SetAttributeDirective, InfoPanelTableComponent, ImportDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    AgGridModule,
    FormsModule,
    ColorPickerModule,
    ResizableModule,
    NgSelectModule,
    ...materialModules
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
    ColorPickerModule,
    ResizableModule,
    NgSelectModule,
    ...materialModules,
    ConfirmationDialogComponent,
    SpinnerComponent,
    NgxPermissionsModule,
    NgxJsonViewerModule,
    AceEditorModule,
    SetAttributeDirective,
    InfoPanelTableComponent
  ],
})
export class SharedModule {}
