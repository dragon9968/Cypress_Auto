import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLevels } from '../core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
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
