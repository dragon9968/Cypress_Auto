import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { TaskService } from 'src/app/core/services/task/task.service';

@Component({
  selector: 'app-add-node-deploy-dialog',
  templateUrl: './add-node-deploy-dialog.component.html',
  styleUrls: ['./add-node-deploy-dialog.component.scss']
})
export class AddNodeDeployDialogComponent {
  deployNewNodeForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddNodeDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
  ) {
    this.deployNewNodeForm = new FormGroup({
      isBackupVMCtr: new FormControl(true),
      isOSCustomizationCtr: new FormControl(true),
    });
  }

  get isBackupVMCtr() { return this.deployNewNodeForm.get('isBackupVMCtr'); }
  get isOSCustomizationCtr() { return this.deployNewNodeForm.get('isOSCustomizationCtr'); }

  onCancel() {
    this.dialogRef.close();
  }

  add() {
    const jsonData = {
      job_name: 'deploy_node',
      pks: this.data.activeNodes.map((ele: any) => ele.data('node_id')).join(","),
      backup_vm: this.isBackupVMCtr?.value,
      os_customization: this.isOSCustomizationCtr?.value,
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
