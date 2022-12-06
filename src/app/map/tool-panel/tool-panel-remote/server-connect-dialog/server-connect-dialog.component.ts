import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription, throwError } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../../project/services/project.service";
import { InfoPanelService } from "../../../../core/services/info-panel/info-panel.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import { retrievedIsConnect } from "../../../../store/server-connect/server-connect.actions";
import { retrievedVMStatus } from "../../../../store/project/project.actions";
import { selectServerConnects } from "../../../../store/server-connect/server-connect.selectors";

@Component({
  selector: 'app-server-connect-dialog',
  templateUrl: './server-connect-dialog.component.html',
  styleUrls: ['./server-connect-dialog.component.scss']
})
export class ServerConnectDialogComponent implements OnInit, OnDestroy {
  serverConnectForm: FormGroup;
  serverConnect!: any[];
  selectServerConnect$ = new Subscription();
  collectionId!: number;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ServerConnectDialogComponent>,
    public helpers: HelpersService,
    private projectService: ProjectService,
    private infoPanelService: InfoPanelService,
    private serverConnectionService: ServerConnectService,
  ) {
    this.selectServerConnect$ = this.store.select(selectServerConnects).subscribe(serverConnect => {
      this.serverConnect = serverConnect;
    });
    this.serverConnectForm = new FormGroup({
      serverConnectCtr: new FormControl('')
    })
  }

  get serverConnectCtr() { return this.serverConnectForm.get('serverConnectCtr'); };

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.collectionId = params['collection_id'];
    })
    this.serverConnectCtr?.setValue(this.serverConnect[0]);
  }

  ngOnDestroy(): void {
    this.selectServerConnect$.unsubscribe();
  }

  connectToServer() {
    const jsonData = {
      pk: this.serverConnectCtr?.value?.id,
      project_id: this.collectionId
    }
    this.serverConnectionService.connect(jsonData)
      .subscribe({
        next: response => {
          this.serverConnectionService.updateConnection(JSON.stringify(response.result));
          this.store.dispatch(retrievedIsConnect({data: true}));
          this.projectService.get(+this.collectionId).subscribe((data: any) => {
            this.store.dispatch(retrievedVMStatus({ vmStatus: data.result.configuration.vm_status }));
            this.infoPanelService.initVMStatus(this.collectionId, response.result.id);
          })
          this.toastr.success(response.message, 'Success');
          this.dialogRef.close();
        },
        error: err => {
          this.toastr.error('Could not to connect the Server', 'Error');
          return throwError(() => err.error.message);
        }
      })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
