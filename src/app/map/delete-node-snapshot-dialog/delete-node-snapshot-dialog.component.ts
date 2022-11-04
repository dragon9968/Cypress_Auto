import { ToastrService } from 'ngx-toastr';
import { Component, Inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from 'src/app/core/services/task/task.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
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
    private infoPanelService: InfoPanelService
  ) {
    this.deleteNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [autoCompleteValidator(this.data.names)]),
    });
  }

  get nameCtr() { return this.helpers.getAutoCompleteCtr(this.deleteNodeSnapshotForm.get('nameCtr'), this.data.names); }

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
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData => {
      this.toastr.success("Task added to the queue");
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
    });
  }
}
