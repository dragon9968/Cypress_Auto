import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TaskService } from "../../core/services/task/task.service";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from "../../shared/validations/auto-complete.validation";
import { selectLoginProfiles } from "../../store/login-profile/login-profile.selectors";

@Component({
  selector: 'app-delete-node-deploy-dialog',
  templateUrl: './delete-node-deploy-dialog.component.html',
  styleUrls: ['./delete-node-deploy-dialog.component.scss']
})
export class DeleteNodeDeployDialogComponent implements OnDestroy {
  deleteNodeDeployForm: FormGroup;
  selectLoginProfiles$ = new Subscription();
  loginProfiles: any[] = [];
  errorMessages = ErrorMessages;
  connection: any;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<DeleteNodeDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helperService: HelpersService,
    private taskService: TaskService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService
  ) {
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(
      loginProfiles => this.loginProfiles = loginProfiles
    );
    this.deleteNodeDeployForm = new FormGroup({
      loginProfileCtr: new FormControl('', [autoCompleteValidator(this.loginProfiles)])
    });
    const connection = this.serverConnectionService.getConnection();
    if (connection) {
      this.connection = connection;
    } else {
      this.connection = {
        id: 0,
        name: 'Test Connection'
      }
    }
  }

  get loginProfileCtr() { return this.helperService.getAutoCompleteCtr(this.deleteNodeDeployForm.get('loginProfileCtr'), this.loginProfiles); }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
  }

  deleteNodeDeployed() {
    const jsonData = {
      connection_id: this.connection ? this.connection.id : 0,
      category: 'node',
      job_name: 'delete_node',
      pks: this.data.activeNodes.map((ele: any) => ele.data('node_id')).join(','),
      login_profile_id: this.loginProfileCtr?.value?.id
    }
    this.taskService.add(jsonData).pipe(
      catchError((err: any) => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(() => err);
      })
    ).subscribe(response => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success('Task added to the queue', 'Success');
    })
  }

}
