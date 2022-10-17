import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';
import { LoginProfilesComponent } from './login-profiles/login-profiles.component';
import { ActionsRenderComponent } from './login-profiles/actions-render/actions-render.component';
import { EditLoginProfilesDialogComponent } from './login-profiles/edit-login-profiles-dialog/edit-login-profiles-dialog.component';


@NgModule({
  declarations: [
    HardwareComponent,
    DeviceTemplateComponent,
    LoginProfilesComponent,
    ActionsRenderComponent,
    EditLoginProfilesDialogComponent
  ],
  imports: [
    SharedModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
