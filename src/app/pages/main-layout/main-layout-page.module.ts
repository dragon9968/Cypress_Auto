import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainLayoutPageRoutingModule } from './main-layout-page-routing.module';
import { MainLayoutPageComponent } from './main-layout-page.component';

@NgModule({
  declarations: [MainLayoutPageComponent],
  imports: [
    MainLayoutPageRoutingModule,
    SharedModule,
  ],
})
export class MainLayoutPageModule {}
