import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LookupFeaturesService } from 'src/app/core/services/lookup-features/lookup-features.service';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedLookupFeatures } from 'src/app/store/lookup-features/lookup-features.actions';

@Component({
  selector: 'app-import-lookup-features-dialog',
  templateUrl: './import-lookup-features-dialog.component.html',
  styleUrls: ['./import-lookup-features-dialog.component.scss']
})
export class ImportLookupFeaturesDialogComponent implements OnInit {
  importForm!: FormGroup;
  selectedFile: any = null;
  constructor(
    private lookupFeaturesService: LookupFeaturesService,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportLookupFeaturesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.importForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
    })
   }

  get fileCtr() { return this.importForm.get('fileCtr');}

  ngOnInit(): void {
  }

  importLookupFeatures() {
    if (this.importForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.lookupFeaturesService.import(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Import Lookup Features successfully`);
          this.dialogRef.close();
          this.lookupFeaturesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupFeatures({ data: data.result })));
          },
        error:(err) => {
          this.toastr.error(err.error.message);
          this.toastr.error(`Error while Import Lookup Features`);
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
