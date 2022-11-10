import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';
import { LoginProfilesComponent } from './login-profiles/login-profiles.component';
import { ActionsRenderComponent } from './login-profiles/actions-render/actions-render.component';
import { EditLoginProfilesDialogComponent } from './login-profiles/edit-login-profiles-dialog/edit-login-profiles-dialog.component';
import { ActionsRenderHardwareComponent } from './hardware/actions-render-hardware/actions-render-hardware.component';
import { AddEditHardwareDialogComponent } from './hardware/add-edit-hardware-dialog/add-edit-hardware-dialog.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { DeviceCategoryRenderComponent } from './device-category/device-category-render/device-category-render.component';
import { AddUpdateDeviceCategoryDialogComponent } from './device-category/add-update-device-category-dialog/add-update-device-category-dialog.component';
import { IconGalleryComponent } from './icon-gallery/icon-gallery.component';
import { AddEditIconDialogComponent } from './icon-gallery/add-edit-icon-dialog/add-edit-icon-dialog.component';
import { AddEditDeviceDialogComponent } from './device-template/add-edit-device-dialog/add-edit-device-dialog.component';
import { ActionRenderDeviceComponent } from './device-template/action-render-device/action-render-device.component';
import { AddEditTemplateDialogComponent } from './device-template/add-edit-template-dialog/add-edit-template-dialog.component';
import { ActionRenderTemplateComponent } from './device-template/action-render-template/action-render-template.component';


@NgModule({
  declarations: [
    HardwareComponent,
    DeviceTemplateComponent,
    LoginProfilesComponent,
    ActionsRenderComponent,
    EditLoginProfilesDialogComponent,
    ActionsRenderHardwareComponent,
    AddEditHardwareDialogComponent,
    DeviceCategoryComponent,
    DeviceCategoryRenderComponent,
    AddUpdateDeviceCategoryDialogComponent,
    IconGalleryComponent,
    AddEditIconDialogComponent,
    AddEditDeviceDialogComponent,
    ActionRenderDeviceComponent,
    AddEditTemplateDialogComponent,
    ActionRenderTemplateComponent
  ],
  imports: [
    SharedModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
