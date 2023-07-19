import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from 'src/app/core/models/app-route.model';
import { MainLayoutComponent } from './main-layout.component';
import { HomeComponent } from '../../home/home.component';
import { PermissionLevels } from 'src/app/core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { RouteSegments } from '../enums/route-segments.enum';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';
import { AuthGuardAdmin } from '../guards/auth-admin.guard';

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
        path: RouteSegments.USER_PROFILE,
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        },
        component: UserProfileComponent,
      },
      {
        path: RouteSegments.PROJECTS,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: RouteSegments.PROJECTS_ADMINISTRATION,
        canActivateChild: [AuthGuardAdmin],
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        },
        loadChildren: () =>
          import('../../project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: RouteSegments.DEVICES,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../devices/devices.module').then(
            (m) => m.DevicesModule
          ),
      },
      {
        path: RouteSegments.PROJECTS_TEMPLATES,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../project/project.module').then(
            (m) => m.ProjectModule
          ),
      },
      {
        path: RouteSegments.LIBRATIES,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
        import('../../libraries/libraries.module').then(
          (m) => m.LibrariesModule
          ),
      },
      {
        path: RouteSegments.REMOTE,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../remote/remote.module').then(
            (m) => m.RemoteModule
          ),
      },
      {
        path: RouteSegments.SETTINGS,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: RouteSegments.HELP,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../help/help.module').then(
            (m) => m.HelpModule
          ),
      },
      {
        path: RouteSegments.ADMINISTRATION,
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        },
        loadChildren: () =>
          import('../../administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
      },
      {
        path: RouteSegments.DASHBOARD,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: RouteSegments.MAP,
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('../../map/map.module').then(
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
