import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectActionsRenderer } from './renderers/project-actions-renderer.component';



@NgModule({
  declarations: [
    ProjectComponent,
    ProjectActionsRenderer
  ],
  imports: [
    ProjectRoutingModule,
    SharedModule
  ]
})
export class ProjectModule { }
