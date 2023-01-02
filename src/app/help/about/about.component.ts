import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppVersionService } from 'src/app/core/services/app-version/app-version.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  appVersion!: any;
  constructor(
    public dialogRef: MatDialogRef<AboutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appVersionService: AppVersionService,
  ) { 
    this.appVersionService.getAll().subscribe(data => {
      this.appVersion = data
    })
  }

  ngOnInit(): void {
  }

  closeAbout() {
    this.dialogRef.close();
  }
}
