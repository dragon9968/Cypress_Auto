import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from 'src/app/core/models/app-route.model';
import { DashboardComponent } from './dashboard.component';
import { PermissionLevels } from 'src/app/core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';

const routes: AppRoute[] = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: DashboardComponent,
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
export class DashboardRoutingModule {}
