import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { validateInputFile } from "../../../../shared/validations/format-file.validation";
import { importOSFirmware } from "../../../../store/lookup-os-firmware/lookup-os-firmwares.actions";
import { selectNotification } from "../../../../store/app/app.selectors";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-import-lookup-os-firmware-dialog',
  templateUrl: './import-lookup-os-firmware-dialog.component.html',
  styleUrls: ['./import-lookup-os-firmware-dialog.component.scss']
})
export class ImportLookupOsFirmwareDialogComponent implements OnDestroy {
  importForm!: FormGroup;
  selectedFile: any = null;
  selectNotification$ = new Subscription()
  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<ImportLookupOsFirmwareDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.importForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
    })
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type === 'success') {
        this.dialogRef.close()
      }
    });
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
  }

  get fileCtr() { return this.importForm.get('fileCtr');}

  importLookupOSFirmwares() {
    if (this.importForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.store.dispatch(importOSFirmware({importData: formData}))
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

}
