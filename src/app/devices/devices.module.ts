import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';
import { LoginProfilesComponent } from './login-profiles/login-profiles.component';
import { EditLoginProfilesDialogComponent } from './login-profiles/edit-login-profiles-dialog/edit-login-profiles-dialog.component';
import { AddEditHardwareDialogComponent } from './hardware/add-edit-hardware-dialog/add-edit-hardware-dialog.component';
import { DeviceCategoryComponent } from './device-category/device-category.component';
import { AddUpdateDeviceCategoryDialogComponent } from './device-category/add-update-device-category-dialog/add-update-device-category-dialog.component';
import { IconGalleryComponent } from './icon-gallery/icon-gallery.component';
import { AddEditIconDialogComponent } from './icon-gallery/add-edit-icon-dialog/add-edit-icon-dialog.component';
import { AddEditDeviceDialogComponent } from './device-template/add-edit-device-dialog/add-edit-device-dialog.component';
import { AddEditTemplateDialogComponent } from './device-template/add-edit-template-dialog/add-edit-template-dialog.component';


@NgModule({
  declarations: [
    HardwareComponent,
    DeviceTemplateComponent,
    LoginProfilesComponent,
    EditLoginProfilesDialogComponent,
    AddEditHardwareDialogComponent,
    DeviceCategoryComponent,
    AddUpdateDeviceCategoryDialogComponent,
    IconGalleryComponent,
    AddEditIconDialogComponent,
    AddEditDeviceDialogComponent,
    AddEditTemplateDialogComponent,
  ],
  imports: [
    SharedModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
