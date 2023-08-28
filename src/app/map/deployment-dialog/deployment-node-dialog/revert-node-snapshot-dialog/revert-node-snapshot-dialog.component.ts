import { Observable, Subscription } from "rxjs";
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { Store } from "@ngrx/store";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";
import { addTask } from "../../../../store/user-task/user-task.actions";
import { TaskAddModel } from "../../../../core/models/task.model";


@Component({
  selector: 'app-revert-node-snapshot-dialog',
  templateUrl: './revert-node-snapshot-dialog.component.html',
  styleUrls: ['./revert-node-snapshot-dialog.component.scss']
})
export class RevertNodeSnapshotDialogComponent implements OnDestroy {
  revertNodeSnapshotForm: FormGroup;
  errorMessage = ErrorMessages;
  filteredSnapshots!: Observable<any[]>;
  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RevertNodeSnapshotDialogComponent>,
    public helperService: HelpersService,
    private serverConnectionService: ServerConnectService
  ) {
    this.revertNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.names)])
    });
    this.filteredSnapshots = this.helperService.filterOptions(this.nameCtr, this.data.names);
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if(notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnDestroy(): void {
     this.selectNotification$.unsubscribe();
  }

  get nameCtr() { return this.helperService.getAutoCompleteCtr(this.revertNodeSnapshotForm.get('nameCtr'), this.data.names) };

  revertSnapshot() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonData: TaskAddModel = {
      job_name: 'revert_snapshot',
      category: 'node',
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(','),
      snapshot_name: this.nameCtr?.value?.name,
      hypervisor_id: connection ? connection?.id : 0
    };
    this.store.dispatch(addTask({ task: jsonData }));
  }
}


