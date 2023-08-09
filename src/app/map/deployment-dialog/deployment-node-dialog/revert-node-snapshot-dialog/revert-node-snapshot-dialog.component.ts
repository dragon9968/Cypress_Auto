import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { TaskService } from "../../../../core/services/task/task.service";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";


@Component({
  selector: 'app-revert-node-snapshot-dialog',
  templateUrl: './revert-node-snapshot-dialog.component.html',
  styleUrls: ['./revert-node-snapshot-dialog.component.scss']
})
export class RevertNodeSnapshotDialogComponent {
  revertNodeSnapshotForm: FormGroup;
  errorMessage = ErrorMessages;
  filteredSnapshots!: Observable<any[]>;

  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RevertNodeSnapshotDialogComponent>,
    public helperService: HelpersService,
    private taskService: TaskService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.revertNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.names)])
    });
    this.filteredSnapshots = this.helperService.filterOptions(this.nameCtr, this.data.names);
  }

  get nameCtr() { return this.helperService.getAutoCompleteCtr(this.revertNodeSnapshotForm.get('nameCtr'), this.data.names) };

  revertSnapshot() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonData = {
      job_name: 'revert_snapshot',
      category: 'node',
      pks: this.data.activeNodes.map((ele: any) => ele.id).join(','),
      snapshot_name: this.nameCtr?.value?.name,
      hypervisor_id: connection ? connection?.id : 0
    }
    this.taskService.add(jsonData).pipe(
      catchError(err => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success('Task added to the queue', 'Success');
    })
  }
}


