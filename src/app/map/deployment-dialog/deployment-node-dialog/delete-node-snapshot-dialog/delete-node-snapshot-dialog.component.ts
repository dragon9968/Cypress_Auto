import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { Store } from "@ngrx/store";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";
import { addTask } from "../../../../store/user-task/user-task.actions";

@Component({
  selector: 'app-delete-node-snapshot-dialog',
  templateUrl: './delete-node-snapshot-dialog.component.html',
  styleUrls: ['./delete-node-snapshot-dialog.component.scss']
})
export class DeleteNodeSnapshotDialogComponent implements OnDestroy {
  deleteNodeSnapshotForm: FormGroup;
  errorMessages = ErrorMessages;
  filteredSnapshots!: Observable<any[]>;
  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteNodeSnapshotDialogComponent>,
    public helpers: HelpersService,
    private serverConnectionService: ServerConnectService
  ) {
    this.deleteNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, autoCompleteValidator(this.data.names)]),
    });
    this.filteredSnapshots = this.helpers.filterOptions(this.nameCtr, this.data.names);
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
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
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(","),
      snapshot_name: this.nameCtr?.value?.name,
      hypervisor_id: connection ? connection.id : 0
    };
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
