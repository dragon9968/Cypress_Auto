import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription, throwError } from "rxjs";
import { TaskService } from "../../../../core/services/task/task.service";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

@Component({
  selector: 'app-node-tools-dialog',
  templateUrl: './node-tools-dialog.component.html',
  styleUrls: ['./node-tools-dialog.component.scss']
})
export class NodeToolsDialogComponent implements OnInit {
  nodeToolsForm: FormGroup;
  errorMessages = ErrorMessages;
  isPingTest = false;
  jobName = '';
  loginProfiles: any[] = [];
  selectLoginProfiles$ = new Subscription();
  filteredLoginProfiles!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<NodeToolsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    public helpersService: HelpersService,
    private infoPanelService: InfoPanelService,
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
  }

  ngOnInit(): void {
    const activeNodes = this.data.activeNodes;
    const loginProfileId = activeNodes.find((node: any) => node.data('login_profile_id'))?.data('login_profile_id');
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
    let jsonData: any = {
      pks: this.data.activeNodes.map((node: any) => node.data('node_id')).join(","),
      job_name: this.jobName,
      category: 'node',
      connection_id: connectionId,
      login_profile_id: this.loginProfileCtr?.value?.id
    };
    if (this.isPingTest) {
      jsonData['remote_host'] = this.remoteHostCtr?.value;
    } else {
      jsonData['shell_command'] = this.shellCommandCtr?.value;
    }
    this.taskService.add(jsonData).pipe(
      catchError(error => {
        this.toastr.error('Failed to add task', 'Error');
        return throwError(() => error);
      })
    ).subscribe(() => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success('Add node task to queue', 'Success');
    })
  }
}
