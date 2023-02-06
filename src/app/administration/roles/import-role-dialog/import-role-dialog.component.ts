import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedRole } from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-import-role-dialog',
  templateUrl: './import-role-dialog.component.html',
  styleUrls: ['./import-role-dialog.component.scss']
})
export class ImportRoleDialogComponent implements OnInit {
  importForm!: FormGroup;
  selectedFile: any = null;
  constructor(
    private rolesService: RolesService,
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {  
    this.importForm = new FormGroup({
    fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
  })
}

get fileCtr() { return this.importForm.get('fileCtr');}

  ngOnInit(): void {
  }


  importRole() {
    if (this.importForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.rolesService.import(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Import roles successfully`);
          this.dialogRef.close();
          this.rolesService.getAll().subscribe(data => this.store.dispatch(retrievedRole({ role: data.result })));
          },
        error:(err) => {
            this.toastr.error(`Error while Import roles`);
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
