import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LookupFeaturesService } from 'src/app/core/services/lookup-features/lookup-features.service';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedLookupFeatures } from 'src/app/store/lookup-features/lookup-features.actions';

@Component({
  selector: 'app-update-feature-dialog',
  templateUrl: './update-feature-dialog.component.html',
  styleUrls: ['./update-feature-dialog.component.scss']
})
export class UpdateFeatureDialogComponent implements OnInit {
  updateForm!: FormGroup;
  selectedFile: any = null;

  constructor(
    private lookupFeaturesService: LookupFeaturesService,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<UpdateFeatureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.updateForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json|csv')])
    })
  }

  get fileCtr() { return this.updateForm.get('fileCtr');}

  ngOnInit(): void {
  }

  updateFeature() {
    if (this.updateForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('pk', this.data.pk)
      this.lookupFeaturesService.updateFeature(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Updated Feature successfully`);
          this.dialogRef.close();
          this.lookupFeaturesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupFeatures({ data: data.result })));
          },
        error:(err) => {
            this.toastr.error(`Error while Updated Feature`);
          }
        })
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

}
