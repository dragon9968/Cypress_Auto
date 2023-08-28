import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { catchError, Subscription, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { validateNameExist } from "../../../../shared/validations/name-exist.validation";
import { MapLinkService } from "../../../../core/services/map-link/map-link.service";
import { selectAllProjects } from "../../../../store/project/project.selectors";

@Component({
  selector: 'app-view-update-project-node',
  templateUrl: './view-update-project-node.component.html',
  styleUrls: ['./view-update-project-node.component.scss']
})
export class ViewUpdateProjectNodeComponent implements OnInit, OnDestroy {
  projectNodeAddForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectAllProjects$ = new Subscription();
  projects: any[] = [];
  isViewMode = false;
  constructor(
    private store: Store,
    private toastr: ToastrService,
    public helpers: HelpersService,
    private mapLinkService: MapLinkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewUpdateProjectNodeComponent>
  ) {
    this.projectNodeAddForm = new FormGroup({
      nameCtr: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      notesCtr: new FormControl('')
    })
    this.isViewMode = this.data.mode == 'view';
  }

  get nameCtr() { return this.projectNodeAddForm.get('nameCtr'); }
  get notesCtr() { return this.projectNodeAddForm.get('notesCtr'); }

  ngOnInit(): void {
    this.selectAllProjects$ = this.store.select(selectAllProjects).subscribe(projects => {
      if (projects) {
        this.projects = projects;
        const project = projects.find(project => project.id === this.data.genData.linked_project_id);
        this.notesCtr?.setValue(project.description)
        this.nameCtr?.setValue(project.name);
        this.nameCtr?.setValidators([
          validateNameExist(() => this.projects, this.data.mode, this.data.genData.linked_project_id)
        ])
      }
    });

  }

  ngOnDestroy(): void {
    this.selectAllProjects$.unsubscribe();
  }

  updateProjectNode() {
    const ele = this.data.cy.getElementById(this.data.genData.data.id);
    const jsonDataValue = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.mapLinkService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error('Update project link failed!', 'Error');
        return throwError(() => e);
      })
    ).subscribe((response: any) => {
      ele.data('name', response.result.name);
      this.dialogRef.close();
      this.toastr.success('Updated project link successfully!', 'Success');
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }
}
