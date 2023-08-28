import { Store } from "@ngrx/store";
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { addTask } from "../../../../store/user-task/user-task.actions";
import { selectNotification } from "../../../../store/app/app.selectors";
import { TaskAddModel } from "../../../../core/models/task.model";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";

@Component({
  selector: 'app-add-node-deploy-dialog',
  templateUrl: './add-update-node-deploy-dialog.component.html',
  styleUrls: ['./add-update-node-deploy-dialog.component.scss']
})
export class AddUpdateNodeDeployDialogComponent implements OnInit, OnDestroy {
  deployNewNodeForm: FormGroup;
  selectLoginProfiles$ = new Subscription();
  selectNotification$ = new Subscription();
  loginProfiles: any[] = [];
  errorMessages = ErrorMessages;
  filteredLoginProfiles!: Observable<any[]>;

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<AddUpdateNodeDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private serverConnectionService: ServerConnectService
  ) {
    this.deployNewNodeForm = new FormGroup({
      loginProfileCtr: new FormControl(''),
      isBackupVMCtr: new FormControl(true),
      isOSCustomizationCtr: new FormControl(true),
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpers.filterOptions(this.loginProfileCtr, this.loginProfiles);
    });
    this.selectNotification$ = this.store.select(selectNotification).subscribe(notification => {
      if (notification?.type === NotificationTypes.SUCCESS) {
        this.dialogRef.close();
      }
    })
  }

  ngOnInit(): void {
    const loginProfileId = this.data.selectedNodes[0].login_profile_id;
    if (loginProfileId) {
      this.helpers.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
  }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  get isBackupVMCtr() { return this.deployNewNodeForm.get('isBackupVMCtr'); }
  get isOSCustomizationCtr() { return this.deployNewNodeForm.get('isOSCustomizationCtr'); }
  get loginProfileCtr() { return this.helpers.getAutoCompleteCtr(this.deployNewNodeForm.get('loginProfileCtr'), this.loginProfiles) }

  onCancel() {
    this.dialogRef.close();
  }

  deployNodeAddUpdate() {
    const connection = this.serverConnectionService.getConnection(this.data.category);
    const configurator = this.serverConnectionService.getConnection("configurator");
    const datasource = this.serverConnectionService.getConnection("datasource");
    const jsonData: TaskAddModel = {
      hypervisor_id: connection ? connection.id : 0,
      configurator_id: configurator ? configurator.id : 0,
      datasource_id: datasource ? datasource.id : 0,
      job_name: this.data.jobName,
      category: 'node',
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(","),
      backup_vm: this.isBackupVMCtr?.value,
      os_customization: this.isOSCustomizationCtr?.value,
      login_profile_id: this.loginProfileCtr?.value?.id
    };
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
