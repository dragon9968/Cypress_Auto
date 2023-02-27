import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLevels } from '../core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { ConfigTemplatesComponent } from './config-templates/config-templates.component';
import { IconGalleryComponent } from './image/icon-gallery/icon-gallery.component';
import { LookupFeaturesComponent } from './lookup/lookup-features/lookup-features.component';
import { LookupNamesComponent } from './lookup/lookup-names/lookup-names.component';
import { NetworkTemplatesComponent } from './network-templates/network-templates.component';

const routes: Routes = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'config',
        component: ConfigTemplatesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'network',
        component: NetworkTemplatesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'icon',
        component: IconGalleryComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'lookup_features',
        component: LookupFeaturesComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'lookup_names',
        component: LookupNamesComponent,
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
export class LibrariesRoutingModule { }
