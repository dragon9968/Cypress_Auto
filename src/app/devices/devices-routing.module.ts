import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionLevels } from '../core/enums/permission-levels.enum';
import { PageNotFoundComponent } from '../core/page-not-found/page-not-found.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';
import { HardwareComponent } from './hardware/hardware.component';
import { LoginProfilesComponent } from './login-profiles/login-profiles.component';
import { DeviceCategoryComponent } from "./device-category/device-category.component";

const routes: Routes = [
  {
    path: '',
    data: {
      permissionLevel: PermissionLevels.USER,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'hardware',
        component: HardwareComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'device_category',
        component: DeviceCategoryComponent,
        data: {
          permissionLevel: PermissionLevels.USER
        }
      },
      {
        path: 'device_template',
        component: DeviceTemplateComponent,
        data: {
          permissionLevel: PermissionLevels.USER,
        }
      },
      {
        path: 'login_profiles',
        component: LoginProfilesComponent,
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
export class DevicesRoutingModule { }
