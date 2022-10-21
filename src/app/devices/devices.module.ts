import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';
import { LoginProfilesComponent } from './login-profiles/login-profiles.component';
import { ActionsRenderComponent } from './login-profiles/actions-render/actions-render.component';
import { EditLoginProfilesDialogComponent } from './login-profiles/edit-login-profiles-dialog/edit-login-profiles-dialog.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { DeviceCategoryRenderComponent } from './device-category/device-category-render/device-category-render.component';
import { AddUpdateDeviceCategoryDialogComponent } from './device-category/add-update-device-category-dialog/add-update-device-category-dialog.component';


@NgModule({
  declarations: [
    HardwareComponent,
    DeviceTemplateComponent,
    LoginProfilesComponent,
    ActionsRenderComponent,
    EditLoginProfilesDialogComponent,
    DeviceCategoryComponent,
    DeviceCategoryRenderComponent,
    AddUpdateDeviceCategoryDialogComponent
  ],
  imports: [
    SharedModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
