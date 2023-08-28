import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { Store } from "@ngrx/store";
import { addTask } from "../../../../store/user-task/user-task.actions";
import { TaskAddModel } from "../../../../core/models/task.model";
import { Subscription } from "rxjs";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";

@Component({
  selector: 'app-create-node-snapshot-dialog',
  templateUrl: './create-node-snapshot-dialog.component.html',
  styleUrls: ['./create-node-snapshot-dialog.component.scss']
})
export class CreateNodeSnapshotDialogComponent implements OnDestroy {
  createNodeSnapshotForm: FormGroup;
  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    private serverConnectionService: ServerConnectService,
    public dialogRef: MatDialogRef<CreateNodeSnapshotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
  ) {
    this.createNodeSnapshotForm = new FormGroup({
      nameCtr: new FormControl(''),
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
  }

  get nameCtr() { return this.createNodeSnapshotForm.get('nameCtr'); }

  onCancel() {
    this.dialogRef.close();
  }

  create() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonDataValue: TaskAddModel = {
      job_name: 'create_snapshot',
      category: 'node',
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(","),
      hypervisor_id: connection ? connection.id : 0,
      snapshot_name: this.nameCtr?.value,
    };
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
