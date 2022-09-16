import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';
import { HomeComponent } from 'src/app/home/home.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavBarComponent,
    HomeComponent,
    UserProfileComponent
  ],
  imports: [
    MainLayoutRoutingModule,
    SharedModule,
  ],
})
export class MainLayoutModule {}
