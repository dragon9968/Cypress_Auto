import { Store } from "@ngrx/store";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { TaskAddModel } from "../../../../core/models/task.model";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";
import { addTask } from "../../../../store/user-task/user-task.actions";

@Component({
  selector: 'app-node-tools-dialog',
  templateUrl: './node-tools-dialog.component.html',
  styleUrls: ['./node-tools-dialog.component.scss']
})
export class NodeToolsDialogComponent implements OnInit, OnDestroy {
  nodeToolsForm: FormGroup;
  errorMessages = ErrorMessages;
  isPingTest = false;
  jobName = '';
  loginProfiles: any[] = [];
  selectLoginProfiles$ = new Subscription();
  selectNotification$ = new Subscription();
  filteredLoginProfiles!: Observable<any[]>;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<NodeToolsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpersService: HelpersService,
    private serviceConnectionService: ServerConnectService
  ) {
    this.nodeToolsForm = new FormGroup({
      loginProfileCtr: new FormControl(''),
      remoteHostCtr: new FormControl('', [Validators.required]),
      shellCommandCtr: new FormControl('', [Validators.required])
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpersService.filterOptions(this.loginProfileCtr, this.loginProfiles);
    });
    this.isPingTest = this.data.jobName == 'ping_test';
    this.jobName = this.data.jobName;
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close()
      }
    })
  }

  ngOnDestroy(): void {
    this.selectNotification$.unsubscribe();
  }

  ngOnInit(): void {
    const loginProfileId = this.data.selectedNodes[0].login_profile_id;
    if (loginProfileId) {
      this.helpersService.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
    if (this.isPingTest) {
      this.remoteHostCtr?.enable();
      this.shellCommandCtr?.disable();
    } else {
      this.remoteHostCtr?.disable();
      this.shellCommandCtr?.enable();
    }
  }

  get remoteHostCtr() { return this.nodeToolsForm.get('remoteHostCtr'); }
  get shellCommandCtr() { return this.nodeToolsForm.get('shellCommandCtr'); }
  get loginProfileCtr() { return this.helpersService.getAutoCompleteCtr(this.nodeToolsForm.get('loginProfileCtr'), this.loginProfiles) }

  goNodeTool() {
    const connection = this.serviceConnectionService.getConnection(this.data.category);
    const connectionId = connection ? connection.id : 0;
    let jsonData: TaskAddModel = {
      pks: this.data.selectedNodes.map((node: any) => node.id).join(","),
      job_name: this.jobName,
      category: 'node',
      hypervisor_id: connectionId,
      login_profile_id: this.loginProfileCtr?.value?.id
    };
    if (this.isPingTest) {
      jsonData['remote_host'] = this.remoteHostCtr?.value;
    } else {
      jsonData['shell_command'] = this.shellCommandCtr?.value;
    }
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
