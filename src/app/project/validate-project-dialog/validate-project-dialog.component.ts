import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-validate-project-dialog',
  templateUrl: './validate-project-dialog.component.html',
  styleUrls: ['./validate-project-dialog.component.scss']
})
export class ValidateProjectDialogComponent implements OnInit {
  validationResult!: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ValidateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.validationResult = this.sanitizer.bypassSecurityTrustHtml(this.data);
   }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

}
