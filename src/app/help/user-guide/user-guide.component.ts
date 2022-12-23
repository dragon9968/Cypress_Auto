import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/core/services/guide/guide.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { UploadUserGuideDialogComponent } from './upload-user-guide-dialog/upload-user-guide-dialog.component';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss']
})
export class UserGuideComponent implements OnInit {
  userGuideContent!: SafeHtml;
  headings!: NodeListOf<Element>;
  constructor(
    private guideService: GuideService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private helpers: HelpersService,
    private toastr: ToastrService,
  ) {
    this.guideService.getGuide().subscribe(guideData => {
      if (guideData) {
        this.userGuideContent = this.sanitizer.bypassSecurityTrustHtml(guideData.result);
        setTimeout(() => {
          // @ts-ignore: Object is possibly 'null'.
          this.headings = document.querySelector('.markdown').querySelectorAll('h1, h2, h3, h4, h5, h6');
        });
      }
    });
   }

  ngOnInit(): void {
  }

  openUploadUserGuide() {
    this.dialog.open(UploadUserGuideDialogComponent, { width: '450px'});
  }

  downladUserGuide() {
    let file = new Blob();
    this.guideService.dowloadFile().subscribe({
      next: (rest) => {
        file = new Blob([rest], {type: 'application/pdf'});
        this.helpers.downloadBlob('user_guide.pdf', file);
        this.toastr.success("Downloaded user guide file successfully")
      },
      error: (err) => {
        this.toastr.error("Error while downloading the user guide file")
      }
    })
  }

  onClick(elementId: string): void {
    // @ts-ignore: Object is possibly 'null'.
    document.querySelector('#' + elementId).scrollIntoView();
  }
}
