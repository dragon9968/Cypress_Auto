import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedProjects, retrievedProjectsTemplate } from 'src/app/store/project/project.actions';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-clone-project-dialog',
  templateUrl: './clone-project-dialog.component.html',
  styleUrls: ['./clone-project-dialog.component.scss']
})
export class CloneProjectDialogComponent implements OnInit {
  cloneForm!: FormGroup;
  errorMessages = ErrorMessages;
  projectId: any;
  status = 'active';
  constructor(
    private projectService: ProjectService,
    private toastr: ToastrService,
    private store: Store,
    private router: Router,
    public dialogRef: MatDialogRef<CloneProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.cloneForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required]),
      categoryCtr: new FormControl('project')
    })
    this.nameCtr?.setValue(this.data.genData.name)
  }

  get nameCtr () { return this.cloneForm.get('nameCtr') }
  get categoryCtr () { return this.cloneForm.get('categoryCtr') }

  ngOnInit(): void {
    this.projectId = this.projectService.getCollectionId()
  }

  onCancel() {
    this.dialogRef.close();
  }

  cloneProject() {
    if (this.cloneForm.valid) {
      const jsonData = {
        pk: this.projectId,
        category: this.categoryCtr?.value,
        name: this.nameCtr?.value
      }
      this.projectService.cloneProject(jsonData).subscribe({
        next: () => {
          if (this.categoryCtr?.value === 'project') {
            this.toastr.success(`Clone Project successfully`);
            this.projectService.getProjectByStatusAndCategory(this.status, this.categoryCtr?.value).subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
            this.router.navigate([RouteSegments.PROJECTS]);
          } else {
            this.toastr.success(`Clone Project to Template successfully`);
            this.projectService.getProjectByStatusAndCategory(this.status, this.categoryCtr?.value).subscribe((data: any) => this.store.dispatch(retrievedProjectsTemplate({ template: data.result })));
            this.router.navigate([RouteSegments.TEMPLATES]);
          }
          this.dialogRef.close();
        },
        error: () => {
          this.toastr.error(`Error while Clone Project`);
        }
      })
    }
  }


}
