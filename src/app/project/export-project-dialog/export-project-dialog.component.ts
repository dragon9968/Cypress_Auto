import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-export-project-dialog',
  templateUrl: './export-project-dialog.component.html',
  styleUrls: ['./export-project-dialog.component.scss']
})
export class ExportProjectDialogComponent implements OnInit {
  exportForm!: FormGroup;
  errorMessages = ErrorMessages;
  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private helpers: HelpersService,
    public dialogRef: MatDialogRef<ExportProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.exportForm = new FormGroup({
      fileNameCtr: new FormControl('', [Validators.required])
    })
  }

  get fileNameCtr() {return this.exportForm.get('fileNameCtr')}

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  exportProject() {
    const jsonData = {
      pks: this.data.pk,
      file_name: this.fileNameCtr?.value
    }
    let file = new Blob();
    var fileName = this.fileNameCtr?.value
    fileName = fileName.replace(/\s+/g, "_");
    const fullFileName = `${fileName}-Export.json` 
    this.projectService.exportProject(jsonData).subscribe(response => {
      file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
      this.helpers.downloadBlob(fullFileName, file);
      this.toastr.success(`Exported project as ${'json'.toUpperCase()} file successfully`);
      this.dialogRef.close();
    });
  }

}
