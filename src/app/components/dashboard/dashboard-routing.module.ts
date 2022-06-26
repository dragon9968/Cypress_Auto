import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionLevels } from 'src/app/enums/permission-levels.enum';
import { AppRoute } from 'src/app/models/app-route.model';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard.component';

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
