import { Store } from "@ngrx/store";
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { TaskService } from 'src/app/core/services/task/task.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

@Component({
  selector: 'app-add-node-deploy-dialog',
  templateUrl: './add-update-node-deploy-dialog.component.html',
  styleUrls: ['./add-update-node-deploy-dialog.component.scss']
})
export class AddUpdateNodeDeployDialogComponent implements OnInit, OnDestroy {
  deployNewNodeForm: FormGroup;
  selectLoginProfiles$ = new Subscription();
  loginProfiles: any[] = [];
  errorMessages = ErrorMessages;
  filteredLoginProfiles!: Observable<any[]>;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddUpdateNodeDeployDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpers: HelpersService,
    private taskService: TaskService,
    private infoPanelService: InfoPanelService,
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
  }

  ngOnInit(): void {
    const loginProfileId = this.data.activeNodes[0].login_profile_id;
    if (loginProfileId) {
      this.helpers.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
  }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
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
    const jsonData = {
      hypervisor_id: connection ? connection.id : 0,
      configurator_id: configurator ? configurator.id : 0,
      datasource_id: datasource ? datasource.id : 0,
      job_name: this.data.jobName,
      category: 'node',
      pks: this.data.activeNodes.map((ele: any) => ele.id).join(","),
      backup_vm: this.isBackupVMCtr?.value,
      os_customization: this.isOSCustomizationCtr?.value,
      login_profile_id: this.loginProfileCtr?.value?.id
    };
    this.taskService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success("Task added to the queue", 'Success');
    });
  }
}
