import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ProjectService } from '../services/project.service';
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import { selectProjectName } from "../../store/project/project.selectors";

@Component({
  selector: 'app-export-project-dialog',
  templateUrl: './export-project-dialog.component.html',
  styleUrls: ['./export-project-dialog.component.scss']
})
export class ExportProjectDialogComponent implements OnInit, OnDestroy {
  exportForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectProjectName$ = new Subscription();
  projectName = '';
  constructor(
    private store: Store,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private helpers: HelpersService,
    public dialogRef: MatDialogRef<ExportProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.exportForm = new FormGroup({
      fileNameCtr: new FormControl('', [Validators.required])
    })
    this.selectProjectName$ = this.store.select(selectProjectName).subscribe(projectName => {
      this.projectName = projectName
    })
  }

  ngOnDestroy(): void {
    this.selectProjectName$.unsubscribe();
  }

  get fileNameCtr() { return this.exportForm.get('fileNameCtr') }

  ngOnInit(): void {
    this.fileNameCtr?.setValue(this.projectName + '-' + this.helpers.getDateformatYYYYMMDDHHMMSS(new Date()));
  }

  onCancel() {
    this.dialogRef.close();
  }

  exportProject() {
    const jsonData = {
      pks: this.data.pks,
      file_name: this.fileNameCtr?.value
    }
    let file = new Blob();
    var fileName = this.fileNameCtr?.value
    fileName = fileName.replace(/\s+/g, "_");
    const fullFileName = `${fileName}.json`
    this.projectService.exportProject(jsonData).subscribe(response => {
      file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
      this.helpers.downloadBlob(fullFileName, file);
      this.toastr.success(`Exported project as ${'json'.toUpperCase()} file successfully`);
      this.dialogRef.close();
    });
  }

}
