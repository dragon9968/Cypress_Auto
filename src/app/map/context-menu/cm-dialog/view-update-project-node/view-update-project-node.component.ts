import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { catchError, Subscription, throwError } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { validateNameExist } from "../../../../shared/validations/name-exist.validation";
import { selectNodesByCollectionId } from "../../../../store/node/node.selectors";
import { retrievedMapSelection } from "../../../../store/map-selection/map-selection.actions";
import { NodeService } from "../../../../core/services/node/node.service";

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
    private nodeService: NodeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewUpdateProjectNodeComponent>
  ) {
    this.projectNodeAddForm = new FormGroup({
      nameCtr: new FormControl('', [
        Validators.required,
        validateNameExist(() => this.nodes, this.data.mode, this.data.genData.node_id)
      ]),
      notesCtr: new FormControl('')
    })
    this.selectNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodes => this.nodes = nodes);
    this.isViewMode = this.data.mode == 'view';
  }

  get nameCtr() { return this.projectNodeAddForm.get('nameCtr'); }
  get notesCtr() { return this.projectNodeAddForm.get('notesCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.notesCtr?.setValue(this.data.genData.notes);
  }

  ngOnDestroy(): void {
    this.selectNodes$.unsubscribe();
  }

  private _updateProjectNodeOnMap(data: any) {
    const ele = this.data.cy.getElementById(this.data.genData.id);
    ele.data('name', data.name);
    ele.data('notes', data.notes);
  }

  updateProjectNode() {
    const ele = this.data.cy.getElementById('node-' + this.data.genData.id);
    const jsonDataValue = {
      name: this.nameCtr?.value,
      notes: this.notesCtr?.value,
      logical_map_position: ele.position(),
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.nodeService.put(this.data.genData.node_id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error('Update Project Node failed!', 'Error');
        return throwError(() => e);
      })
    ).subscribe((_respData: any) => {
      this.store.dispatch(retrievedMapSelection({ data: true }));
      this.nodeService.get(this.data.genData.node_id).subscribe(nodeData => {
        this.helpers.updateNodesStorage(nodeData.result);
        this._updateProjectNodeOnMap(nodeData.result);
        this.dialogRef.close();
        this.store.dispatch(retrievedMapSelection({ data: true }));
        this.toastr.success('Project Node details updated!', 'Success');
      });
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }
}
