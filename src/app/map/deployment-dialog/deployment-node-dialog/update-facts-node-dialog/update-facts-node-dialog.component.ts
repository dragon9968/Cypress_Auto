import { Store } from "@ngrx/store";
import { catchError } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { TaskService } from "../../../../core/services/task/task.service";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { selectLoginProfiles } from "../../../../store/login-profile/login-profile.selectors";
import { autoCompleteValidator } from "../../../../shared/validations/auto-complete.validation";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

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

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateFactsNodeDialogComponent>,
    private taskService: TaskService,
    public helpersService: HelpersService,
    private infoPanelService: InfoPanelService,
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
    this.taskService.add(jsonData).pipe(
      catchError(err => {
        this.toastr.error(err.error.message, 'Error');
        return throwError(() => err);
      })
    ).subscribe(() => {
      this.infoPanelService.updateTaskList();
      this.dialogRef.close();
      this.toastr.success('Task added to the queue', 'Success');
    })
  }

}
