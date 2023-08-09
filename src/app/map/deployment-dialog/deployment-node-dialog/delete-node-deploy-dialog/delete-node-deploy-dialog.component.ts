import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from "../../../../core/services/task/task.service";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

@Component({
  selector: 'app-delete-node-deploy-dialog',
  templateUrl: './delete-node-deploy-dialog.component.html',
  styleUrls: ['./delete-node-deploy-dialog.component.scss']
})
export class DeleteNodeDeployDialogComponent implements OnInit, OnDestroy {
  deleteNodeDeployForm: FormGroup;
  selectLoginProfiles$ = new Subscription();
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
  }

  ngOnInit(): void {
    const activeNodes = this.data.activeNodes;
    const loginProfileId = activeNodes.find((node: any) => node.data('login_profile_id'))?.data('login_profile_id');
    if (loginProfileId) {
      this.helperService.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, loginProfileId);
    }
  }

  get loginProfileCtr() { return this.helperService.getAutoCompleteCtr(this.deleteNodeDeployForm.get('loginProfileCtr'), this.loginProfiles); }

  ngOnDestroy(): void {
    this.selectLoginProfiles$.unsubscribe();
  }

  deleteNodeDeployed() {
    const jsonData = {
      hypervisor_id: this.connection ? this.connection.id : 0,
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
