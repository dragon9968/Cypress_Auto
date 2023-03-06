import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLevels } from '../core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { AuthGuardAdmin } from "../core/guards/auth-admin.guard";

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuardAdmin],
    data: {
      permissionLevel: PermissionLevels.ADMIN,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'users',
        component: UsersComponent,
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        }
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        }
      },
      {
        path: '**',
        data: {
          permissionLevel: PermissionLevels.ADMIN,
        },
        runGuardsAndResolvers: 'always',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
