import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionLevels } from 'src/app/enums/permission-levels.enum';
import { AppRoute } from 'src/app/models/app-route.model';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { MainLayoutPageComponent } from './main-layout-page.component';

const routes: AppRoute[] = [
  {
    path: '',
    component: MainLayoutPageComponent,
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
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
export class MainLayoutPageRoutingModule {}
