import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from 'src/app/core/models/app-route.model';
import { ProjectComponent } from './project.component';
import { PermissionLevels } from 'src/app/core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { AddProjectComponent } from 'src/app/project/add-project/add-project.component';
import { TrashBinProjectComponent } from './trash-bin-project/trash-bin-project.component';

const routes: AppRoute[] = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'add',
        component: AddProjectComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'trash',
        component: TrashBinProjectComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'templates',
        component: ProjectComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: '',
        component: ProjectComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: '**',
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        runGuardsAndResolvers: 'always',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
