import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';

@Component({
  selector: 'app-export-role-dialog',
  templateUrl: './export-role-dialog.component.html',
  styleUrls: ['./export-role-dialog.component.scss']
})
export class ExportRoleDialogComponent implements OnInit {
  exportForm!: FormGroup;
  errorMessages = ErrorMessages;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private rolesService: RolesService,
    private helpers: HelpersService,
    public dialogRef: MatDialogRef<ExportRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.exportForm = new FormGroup({
      fileNameCtr: new FormControl('', [Validators.required])
    })
  }

  get fileNameCtr() { return this.exportForm.get('fileNameCtr') }

  ngOnInit(): void {
    if (this.data.pks.length === 1) {
      this.fileNameCtr?.setValue(this.data.name)
    } else {
      this.fileNameCtr?.setValue('cro_user_roles')
    }

  }

  exportRoles() {
    const jsonDataValue = {
      pks: this.data.pks,
      file_name: this.fileNameCtr?.value
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    let file = new Blob();
    var fileName = this.fileNameCtr?.value
    fileName = fileName.replace(/\s+/g, "_");
    const fullFileName = `${fileName}.json`
    this.rolesService.export(jsonData).subscribe(response => {
      file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
      this.helpers.downloadBlob(fullFileName, file);
      this.toastr.success(`Exported Roles as JSON file successfully`);
      this.dialogRef.close();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

}
