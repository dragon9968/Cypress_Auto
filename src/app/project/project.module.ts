import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectActionsRendererComponent } from './renderers/project-actions-renderer.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ExportImportProjectComponent } from './export-import-project/export-import-project.component';
import { EditProjectDialogComponent } from './edit-project-dialog/edit-project-dialog.component';


@NgModule({
  declarations: [
    ProjectComponent,
    AddProjectComponent,
    ProjectActionsRendererComponent,
    ExportImportProjectComponent,
    EditProjectDialogComponent
  ],
  imports: [
    ProjectRoutingModule,
    SharedModule
  ]
})
export class ProjectModule { }
