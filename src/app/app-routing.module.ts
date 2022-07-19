import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoute } from './shared/models/app-route.model';
import { PermissionLevels } from './shared/enums/permission-levels.enum';
import { RouteSegments } from './shared/enums/routes/route-segments.enum';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

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
          import('./main-layout/main-layout.module').then(
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
