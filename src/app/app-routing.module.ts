import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PermissionLevels } from './core/enums/permission-levels.enum';
import { RouteSegments } from './core/enums/routes/route-segments.enum';
import { AuthGuard } from './core/guards/auth.guard';
import { AppRoute } from './core/models/app-route.model';

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
          import('./components/main-layout/main-layout.module').then(
            (m) => m.MainLayoutModule
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
