import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavBarComponent
  ],
  imports: [
    MainLayoutRoutingModule,
    SharedModule,
  ],
})
export class MainLayoutModule {}
