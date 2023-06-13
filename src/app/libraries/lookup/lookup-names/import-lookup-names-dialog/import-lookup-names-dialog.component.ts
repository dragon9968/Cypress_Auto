import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { LookupNamesService } from 'src/app/core/services/lookup-names/lookup-names.service';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedLookupNames } from 'src/app/store/lookup-names/lookup-names.actions';

@Component({
  selector: 'app-import-lookup-names-dialog',
  templateUrl: './import-lookup-names-dialog.component.html',
  styleUrls: ['./import-lookup-names-dialog.component.scss']
})
export class ImportLookupNamesDialogComponent implements OnInit {
  importForm!: FormGroup;
  selectedFile: any = null;
  constructor(
    private lookupNamesService: LookupNamesService,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportLookupNamesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.importForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
    })
  }

  ngOnInit(): void {
  }

  get fileCtr() { return this.importForm.get('fileCtr');}

  importLookupNames() {
    if (this.importForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.lookupNamesService.import(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Import Lookup Names successfully`);
          this.dialogRef.close();
          this.lookupNamesService.getAll().subscribe(data => this.store.dispatch(retrievedLookupNames({ data: data.result })));
          },
        error:(err) => {
            this.toastr.error(`Error while Import Lookup Names`);
          }
        })
    }
  }
  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

  onCancel() {
    this.dialogRef.close();
  }

}
