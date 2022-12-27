import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { GuideService } from 'src/app/core/services/guide/guide.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedUserGuide } from 'src/app/store/user-guide/user-guide.actions';

@Component({
  selector: 'app-upload-user-guide-dialog',
  templateUrl: './upload-user-guide-dialog.component.html',
  styleUrls: ['./upload-user-guide-dialog.component.scss']
})
export class UploadUserGuideDialogComponent implements OnInit {
  errorMessage = ErrorMessages;
  uploadForm!: FormGroup;
  selectedFile: any = null;
  constructor(
    private toastr: ToastrService,
    private store: Store,
    private guideService: GuideService,
    public dialogRef: MatDialogRef<UploadUserGuideDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.uploadForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('md')])
    })
  }

  get fileCtr() { return this.uploadForm.get('fileCtr');}

  ngOnInit(): void {
  }

  uploadUserGuide() {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.guideService.uploadUserGuide(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Upload user guide file successfully`);
          this.store.dispatch(retrievedUserGuide({ data: false }));
          this.dialogRef.close();
          },
        error:(err) => {
            this.toastr.error(`Error while upload user guide file`);
          }
        })
    }
  }

  onCancel() {
    this.dialogRef.close()
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

}
