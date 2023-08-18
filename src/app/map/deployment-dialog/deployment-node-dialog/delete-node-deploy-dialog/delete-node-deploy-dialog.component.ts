import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from "../../../../core/services/task/task.service";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { TaskAddModel } from "../../../../core/models/task.model";
import { addTask } from "../../../../store/user-task/user-task.actions";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";

@Component({
  selector: 'app-delete-node-deploy-dialog',
  templateUrl: './delete-node-deploy-dialog.component.html',
  styleUrls: ['./delete-node-deploy-dialog.component.scss']
})
export class DeleteNodeDeployDialogComponent implements OnInit, OnDestroy {
  deleteNodeDeployForm: FormGroup;
  selectLoginProfiles$ = new Subscription();
  selectNotification$ = new Subscription();
  loginProfiles: any[] = [];
  errorMessages = ErrorMessages;
  connection: any;
  filteredLoginProfiles!: Observable<any[]>;

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
    this.deleteNodeDeployForm = new FormGroup({
      loginProfileCtr: new FormControl('')
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helperService.filterOptions(this.loginProfileCtr, this.loginProfiles);
    });
    const connection = this.serverConnectionService.getConnection(this.data.category);
    if (connection) {
      this.connection = connection;
    } else {
      this.connection = {
        id: 0,
        name: 'Test Connection'
      }
    }
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnInit(): void {
    const loginProfileId = this.data.selectedNodes[0].login_profile_id;
    if (loginProfileId) {
      this.helperService.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
  }

  get loginProfileCtr() { return this.helperService.getAutoCompleteCtr(this.deleteNodeDeployForm.get('loginProfileCtr'), this.loginProfiles); }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  deleteNodeDeployed() {
    const jsonData: TaskAddModel = {
      hypervisor_id: this.connection ? this.connection.id : 0,
      category: 'node',
      job_name: 'delete_node',
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(','),
      login_profile_id: this.loginProfileCtr?.value?.id
    }
    this.store.dispatch(addTask({ task: jsonData }));
  }

}
