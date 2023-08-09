import { ToastrService } from 'ngx-toastr';
import { Component, Inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { TaskService } from 'src/app/core/services/task/task.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";


@Component({
  selector: 'app-delete-node-snapshot-dialog',
  templateUrl: './delete-node-snapshot-dialog.component.html',
  styleUrls: ['./delete-node-snapshot-dialog.component.scss']
})
export class DeleteNodeSnapshotDialogComponent {
  deleteNodeSnapshotForm: FormGroup;
  errorMessages = ErrorMessages;
  filteredSnapshots!: Observable<any[]>;


  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteNodeSnapshotDialogComponent>,
    public helpers: HelpersService,
    private taskService: TaskService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.deleteNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.names)]),
    });
    this.filteredSnapshots = this.helpers.filterOptions(this.nameCtr, this.data.names);
  }

  get nameCtr() { return this.helpers.getAutoCompleteCtr(this.deleteNodeSnapshotForm.get('nameCtr'), this.data.names); }

  onCancel() {
    this.dialogRef.close();
  }

  deleteSnapshot() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonData = {
      job_name: 'delete_snapshot',
      category: 'node',
      pks: this.data.activeNodes.map((ele: any) => ele.data('node_id')).join(","),
      snapshot_name: this.nameCtr?.value?.name,
      hypervisor_id: connection ? connection.id : 0
    };
    this.taskService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message, 'Error');
        return throwError(() => e);
      })
    ).subscribe(respData => {
      this.toastr.success('Task added to the queue', 'Success');
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
    });
  }
}
