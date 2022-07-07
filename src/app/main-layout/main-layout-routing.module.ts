import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from 'src/app/shared/models/app-route.model';
import { MainLayoutComponent } from './main-layout.component';
import { HomeComponent } from '../home/home.component';
import { PermissionLevels } from 'src/app/shared/enums/permission-levels.enum';
import { RouteSegments } from 'src/app/shared/enums/routes/route-segments.enum';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: AppRoute[] = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        component: HomeComponent,
      },
      {
        path: RouteSegments.PROJECTS,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: RouteSegments.DASHBOARD,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: RouteSegments.MAP,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../map/map.module').then(
            (m) => m.MapModule
          ),
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
export class MainLayoutRoutingModule {}
