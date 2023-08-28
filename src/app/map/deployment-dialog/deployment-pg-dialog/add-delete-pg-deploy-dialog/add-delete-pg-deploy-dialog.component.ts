import { Subscription } from "rxjs";
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { Store } from "@ngrx/store";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";
import { addTask } from "../../../../store/user-task/user-task.actions";

@Component({
  selector: 'app-add-delete-pg-deploy-dialog',
  templateUrl: './add-delete-pg-deploy-dialog.component.html',
  styleUrls: ['./add-delete-pg-deploy-dialog.component.scss']
})
export class AddDeletePGDeployDialogComponent implements OnDestroy {

  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<AddDeletePGDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serverConnectionService: ServerConnectService,
  ) {
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
  }

  addDeletePortGroupDeploy() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonData = {
      job_name: this.data.jobName,
      category: 'port_group',
      pks: this.data.selectedPGs.map((ele: any) => ele.id).join(','),
      hypervisor_id: connection ? connection.id : 0,
    }
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
