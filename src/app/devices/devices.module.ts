import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesRoutingModule } from './devices-routing.module';
import { HardwareComponent } from './hardware/hardware.component';
import { DeviceTemplateComponent } from './device-template/device-template.component';


@NgModule({
  declarations: [
    HardwareComponent,
    DeviceTemplateComponent
  ],
  imports: [
    SharedModule,
    DevicesRoutingModule
  ]
})
export class DevicesModule { }
