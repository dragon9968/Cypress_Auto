import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { catchError, Subscription, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { validateNameExist } from "../../../../shared/validations/name-exist.validation";
import { selectNodesByProjectId } from "../../../../store/node/node.selectors";
import { MapLinkService } from "../../../../core/services/map-link/map-link.service";
import { ProjectService } from "../../../../project/services/project.service";

@Component({
  selector: 'app-view-update-project-node',
  templateUrl: './view-update-project-node.component.html',
  styleUrls: ['./view-update-project-node.component.scss']
})
export class ViewUpdateProjectNodeComponent implements OnInit, OnDestroy {
  projectNodeAddForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectNodes$ = new Subscription();
  isViewMode = false;
  nodes!: any[];
  constructor(
    private store: Store,
    private toastr: ToastrService,
    public helpers: HelpersService,
    private mapLinkService: MapLinkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    public dialogRef: MatDialogRef<ViewUpdateProjectNodeComponent>
  ) {
    this.projectNodeAddForm = new FormGroup({
      nameCtr: new FormControl('', [
        Validators.required,
        validateNameExist(() => this.nodes, this.data.mode, this.data.genData.node_id)
      ]),
      notesCtr: new FormControl('')
    })
    this.selectNodes$ = this.store.select(selectNodesByProjectId).subscribe(nodes => this.nodes = nodes);
    this.isViewMode = this.data.mode == 'view';
    this.projectService.get(this.data.genData.linked_project_id).subscribe(response => {
      this.notesCtr?.setValue(response.result.description)
    })
  }

  get nameCtr() { return this.projectNodeAddForm.get('nameCtr'); }
  get notesCtr() { return this.projectNodeAddForm.get('notesCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
  }

  ngOnDestroy(): void {
    this.selectNodes$.unsubscribe();
  }

  updateProjectNode() {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    const jsonDataValue = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.mapLinkService.put(this.data.genData.map_link_id, jsonData).pipe(
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
