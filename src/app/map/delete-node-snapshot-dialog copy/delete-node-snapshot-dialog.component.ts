import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';

@Component({
  selector: 'app-delete-node-snapshot-dialog',
  templateUrl: './delete-node-snapshot-dialog.component.html',
  styleUrls: ['./delete-node-snapshot-dialog.component.scss']
})
export class DeleteNodeSnapshotDialogComponent {
  deleteNodeSnapshotForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<DeleteNodeSnapshotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
  ) {
    this.deleteNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [autoCompleteValidator(this.data.names)]),
    });
  }

  get nameCtr() { return this.deleteNodeSnapshotForm.get('nameCtr'); }

  onCancel() {
    this.dialogRef.close();
  }

  deleteSnapshot() {
    const jsonData = {
      job_name: 'delete_snapshot',
      pks: this.data.activeNodes.map((ele: any) => ele.data('node_id')).join(","),
      snapshot_name: this.nameCtr?.value.id,
    };
    this.taskService.add(jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(error.message);
        return throwError(() => error);
      })
    ).subscribe(respData => {
      this.toastr.success("Task added to the queue");
    });
  }
}
