import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { retrievedProjects } from 'src/app/store/project/project.actions';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-import-project-dialog',
  templateUrl: './import-project-dialog.component.html',
  styleUrls: ['./import-project-dialog.component.scss']
})
export class ImportProjectDialogComponent implements OnInit {
  importForm!: FormGroup;
  selectedFile: any = null;
  isLoading = false;
  constructor(
    private projectService: ProjectService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ImportProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.importForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
    })
  }

  get fileCtr() { return this.importForm.get('fileCtr');}

  ngOnInit(): void {
  }

  importProject() {
    if (this.importForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.projectService.importProject(formData).subscribe({
        next:(rest) => {
          this.toastr.success(`Import project successfully`);
          this.dialogRef.close();
          this.router.navigate([RouteSegments.PROJECTS]);
          this.projectService.getProjectByStatus('active').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
          this.isLoading = false;
          },
        error:(err) => {
            this.toastr.error(`Error while Import project`);
            this.isLoading = false;
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
