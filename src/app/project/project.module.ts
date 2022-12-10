import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectActionsRendererComponent } from './renderers/project-actions-renderer.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';
import { ExportProjectDialogComponent } from './export-project-dialog/export-project-dialog.component';
import { TrashBinProjectComponent } from './trash-bin-project/trash-bin-project.component';
import { ImportProjectDialogComponent } from './import-project-dialog/import-project-dialog.component';
import { ButtonRenderersComponent } from './renderers/button-renderers-component';


@NgModule({
  declarations: [
    ProjectComponent,
    AddProjectComponent,
    ProjectActionsRendererComponent,
    EditProjectDialogComponent,
    ExportProjectDialogComponent,
    TrashBinProjectComponent,
    ImportProjectDialogComponent,
    ButtonRenderersComponent
  ],
  imports: [
    ProjectRoutingModule,
    SharedModule
  ]
})
export class ProjectModule { }
