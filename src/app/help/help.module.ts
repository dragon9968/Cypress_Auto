import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';
import { UserGuideComponent } from './user-guide/user-guide.component';
import { AboutComponent } from './about/about.component';
import { UploadUserGuideDialogComponent } from './user-guide/upload-user-guide-dialog/upload-user-guide-dialog.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    UserGuideComponent,
    AboutComponent,
    UploadUserGuideDialogComponent
  ],
  imports: [
    SharedModule,
    MarkdownModule.forRoot(),
    HelpRoutingModule
  ]
})
export class HelpModule { }
