import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';

@Component({
  selector: 'app-create-node-snapshot-dialog',
  templateUrl: './create-node-snapshot-dialog.component.html',
  styleUrls: ['./create-node-snapshot-dialog.component.scss']
})
export class CreateNodeSnapshotDialogComponent {
  createNodeSnapshotForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CreateNodeSnapshotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
  ) {
    this.createNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl(''),
    });
  }

  get nameCtr() { return this.createNodeSnapshotForm.get('nameCtr'); }

  onCancel() {
    this.dialogRef.close();
  }

  create() {
    const jsonData = {
      job_name: 'create_snapshot',
      pks: this.data.activeNodes.map((ele: any) => ele.data('node_id')).join(","),
      snapshot_name: this.nameCtr?.value,
    };
    this.taskService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData => {
      this.toastr.success("Task added to the queue");
    });
  }
}
