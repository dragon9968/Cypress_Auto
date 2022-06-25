import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PermissionLevels } from './enums/permission-levels.enum';
import { RouteSegments } from './enums/routes/route-segments.enum';
import { AppRoute } from './models/app-route.model';
import { LoginPageComponent } from './shared/components/login/login-page.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: AppRoute[] = [
  {
    path: RouteSegments.LOGIN,
    component: LoginPageComponent,
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    children: [
      {
        path: '',
        data: {
          permissionLevel: PermissionLevels.USER,
        },
        loadChildren: () =>
          import('./pages/main-layout/main-layout-page.module').then(
            (m) => m.MainLayoutPageModule
          ),
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
