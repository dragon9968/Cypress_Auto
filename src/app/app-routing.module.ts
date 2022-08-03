import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from './core/models/app-route.model';
import { PermissionLevels } from './core/enums/permission-levels.enum';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { RouteSegments } from './core/enums/route-segments.enum';

const routes: AppRoute[] = [
  {
    path: RouteSegments.LOGIN,
    component: LoginComponent,
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
          import('./core/main-layout/main-layout.module').then(
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
