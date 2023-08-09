import { TaskService } from 'src/app/core/services/task/task.service';
import { ToastrService } from 'ngx-toastr';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { catchError, throwError } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

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
    private serverConnectionService: ServerConnectService,
    public dialogRef: MatDialogRef<CreateNodeSnapshotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private infoPanelService: InfoPanelService
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
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonDataValue = {
      job_name: 'create_snapshot',
      category: 'node',
      pks: this.data.activeNodes.map((ele: any) => ele.id).join(","),
      hypervisor_id: connection ? connection.id : 0,
      snapshot_name: this.nameCtr?.value,
    };
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
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
