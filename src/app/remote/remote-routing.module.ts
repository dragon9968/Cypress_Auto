import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLevels } from '../core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { ConnectComponent } from './connect/connect.component';
import { ConnectionProfilesComponent } from './connection-profiles/connection-profiles.component';
import { AddEditConnectionProfilesComponent } from './add-edit-connection-profiles/add-edit-connection-profiles.component';
import { ShowConnectionProfilesComponent } from './show-connection-profiles/show-connection-profiles.component';

const routes: Routes = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'connect',
        component: ConnectComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'connection-profiles',
        component: ConnectionProfilesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'connection-profiles/show/:id',
        component: ShowConnectionProfilesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'connection-profiles/add',
        component: AddEditConnectionProfilesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'connection-profiles/edit/:id',
        component: AddEditConnectionProfilesComponent,
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
  exports: [RouterModule]
})
export class RemoteRoutingModule { }
