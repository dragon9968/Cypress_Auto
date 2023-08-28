import { Store } from "@ngrx/store";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";
import { selectNotification } from "../../../../store/app/app.selectors";
import { NotificationTypes } from "../../../../shared/enums/notifications-types.enum";
import { addTask } from "../../../../store/user-task/user-task.actions";

@Component({
  selector: 'app-update-facts-node-dialog',
  templateUrl: './update-facts-node-dialog.component.html',
  styleUrls: ['./update-facts-node-dialog.component.scss']
})
export class UpdateFactsNodeDialogComponent implements OnInit, OnDestroy {
  updateFactsNodeForm: FormGroup;
  errorMessages = ErrorMessages;
  selectLoginProfiles$ = new Subscription();
  loginProfiles: any[] = [];
  connection: any;
  filteredLoginProfiles!: Observable<any[]>;
  selectNotification$ = new Subscription();

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateFactsNodeDialogComponent>,
    public helpersService: HelpersService,
    private serverConnectionService: ServerConnectService
  ) {
    this.updateFactsNodeForm = new FormGroup({
      loginProfileCtr: new FormControl('')
    })
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpersService.filterOptions(this.loginProfileCtr, this.loginProfiles);
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
      this.helpersService.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
  }

  get loginProfileCtr() { return this.helpersService.getAutoCompleteCtr(this.updateFactsNodeForm.get('loginProfileCtr'), this.loginProfiles) };

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
    this.selectNotification$.unsubscribe();
  }

  updateFactsNode() {
    const connection = this.serverConnectionService.getConnection(RemoteCategories.HYPERVISOR);
    const jsonData = {
      hypervisor_id: connection ? connection.id : 0,
      category: 'node',
      job_name: 'update_facts',
      pks: this.data.selectedNodes.map((ele: any) => ele.id).join(','),
      login_profile_id: this.loginProfileCtr?.value?.id
    }
    this.store.dispatch(addTask({ task: jsonData }));
  }
}
