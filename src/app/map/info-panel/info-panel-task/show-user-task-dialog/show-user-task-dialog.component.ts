import { ToastrService } from "ngx-toastr";
import { FormGroup , FormControl} from "@angular/forms";
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserTaskService } from "../../../../core/services/user-task/user-task.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ConfirmationDialogComponent } from "../../../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AceEditorComponent } from "ng2-ace-editor";

@Component({
  selector: 'app-show-user-task-dialog',
  templateUrl: './show-user-task-dialog.component.html',
  styleUrls: ['./show-user-task-dialog.component.scss']
})
export class ShowUserTaskDialogComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") editor!: AceEditorComponent;
  showUserTaskForm: FormGroup;
  textareaRows = 1;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowUserTaskDialogComponent>,
    private userTaskService: UserTaskService,
    private infoPanelService: InfoPanelService
  ) {
    this.showUserTaskForm = new FormGroup({
      appuserIdCtr: new FormControl(''),
      taskIdCtr: new FormControl(''),
      displayNameCtr: new FormControl(''),
      taskResultCtr: new FormControl(''),
      startTimeCtr: new FormControl(''),
      endTimeCtr: new FormControl(''),
      revokedCtr: new FormControl(''),
      taskStateCtr: new FormControl(''),
      taskMetadataCtr: new  FormControl('')
    })
  }

  get appuserIdCtr() { return this.showUserTaskForm.get('appuserIdCtr'); };
  get taskIdCtr() { return this.showUserTaskForm.get('taskIdCtr'); };
  get displayNameCtr() { return this.showUserTaskForm.get('displayNameCtr'); };
  get taskResultCtr() { return this.showUserTaskForm.get('taskResultCtr'); };
  get startTimeCtr() { return this.showUserTaskForm.get('startTimeCtr'); };
  get endTimeCtr() { return this.showUserTaskForm.get('endTimeCtr'); };
  get revokedCtr() { return this.showUserTaskForm.get('revokedCtr'); };
  get taskStateCtr() { return this.showUserTaskForm.get('taskStateCtr'); };
  get taskMetadataCtr() { return this.showUserTaskForm.get('taskMetadataCtr'); };

  ngOnInit(): void {
    this.appuserIdCtr?.setValue(this.data.genData.appuser_id);
    this.taskIdCtr?.setValue(this.data.genData.task_id);
    this.displayNameCtr?.setValue(this.data.genData.display_name);
    this.taskResultCtr?.setValue(this.data.genData.task_result);
    if (this.data.genData.start_time) {
      this.startTimeCtr?.setValue(this.data.genData.start_time.replace('T', ' '));
    } else {
      this.startTimeCtr?.setValue(this.data.genData.start_time);
    }
    if (this.data.genData.end_time) {
      this.endTimeCtr?.setValue(this.data.genData.end_time.replace('T', ' '));
    } else {
      this.endTimeCtr?.setValue(this.data.genData.end_time);
    }
    this.revokedCtr?.setValue(this.data.genData.revoked);
    this.taskStateCtr?.setValue(this.data.genData.task_state);
    if (this.data.genData.task_metadata) {
      this.textareaRows = 6;
    }
    this.taskMetadataCtr?.setValue(JSON.stringify(this.data.genData.task_metadata));
  }

  ngAfterViewInit(): void {
    this.editor.getEditor().setOptions({
      tabSize: 2,
      useWorker: false,
      fontSize: '16px'
    });
    this.editor.mode = 'text';
    this.editor.setTheme('textmate');
    this.editor.value = this.data.genData.task_result;
    this.editor.getEditor().setShowPrintMargin(false);
    this.editor.setReadOnly(true);
  }

  postTask() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Rerun post task?',
      submitButtonName: 'OK'
    }
    const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
    dialogConfirm.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.infoPanelService.postTask([this.data.genData.id]);
        this.dialogRef.close();
      }
    })
  }

  rerun() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Rerun this task?',
      submitButtonName: 'OK'
    }
    const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
    dialogConfirm.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.infoPanelService.rerunTask([this.data.genData.id]);
        this.dialogRef.close();
      }
    })
  }

  revokeTask() {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'Revoke this task?',
      submitButtonName: 'OK'
    }
    const dialogConfirm = this.dialog.open(ConfirmationDialogComponent, {width: '450px', data: dialogData});
    dialogConfirm.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.infoPanelService.revokeTask([this.data.genData.id]);
        this.dialogRef.close();
      }
    })
  }
}
