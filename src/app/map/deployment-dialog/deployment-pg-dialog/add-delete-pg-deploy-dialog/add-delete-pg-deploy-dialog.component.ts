import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TaskService } from "../../../../core/services/task/task.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";

@Component({
  selector: 'app-add-delete-pg-deploy-dialog',
  templateUrl: './add-delete-pg-deploy-dialog.component.html',
  styleUrls: ['./add-delete-pg-deploy-dialog.component.scss']
})
export class AddDeletePGDeployDialogComponent {

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<AddDeletePGDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService,
  ) {

  }

  addDeletePortGroupDeploy() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const jsonData = {
      job_name: this.data.jobName,
      category: 'port_group',
      pks: this.data.selectedPGs.map((ele: any) => ele.id).join(','),
      hypervisor_id: connection ? connection.id : 0,
    }
    this.taskService.add(jsonData).pipe(
      catchError((err: any) => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success('Add port group task to queue', 'Success');
    })
  }

}
