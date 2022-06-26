import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionLevels } from 'src/app/enums/permission-levels.enum';
import { AppRoute } from 'src/app/models/app-route.model';
import { PageNotFoundComponent } from 'src/app/components/page-not-found/page-not-found.component';
import { MainLayoutComponent } from './main-layout.component';
import { HomeComponent } from '../home/home.component';

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
        path: 'dashboard',
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'map',
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
