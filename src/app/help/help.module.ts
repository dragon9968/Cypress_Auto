import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    UserGuideComponent,
    AboutComponent
  ],
  imports: [
    SharedModule,
    HelpRoutingModule
  ]
})
export class HelpModule { }
