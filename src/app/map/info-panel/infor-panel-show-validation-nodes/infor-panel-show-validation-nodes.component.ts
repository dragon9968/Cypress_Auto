import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-infor-panel-show-validation-nodes',
  templateUrl: './infor-panel-show-validation-nodes.component.html',
  styleUrls: ['./infor-panel-show-validation-nodes.component.scss']
})
export class InforPanelShowValidationNodesComponent implements OnInit {
  validationResult!: SafeHtml;
  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<InforPanelShowValidationNodesComponent>,
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
