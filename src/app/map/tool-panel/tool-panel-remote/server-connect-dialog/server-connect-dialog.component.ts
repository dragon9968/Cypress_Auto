import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { Observable, Subscription, throwError } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { ProjectService } from "../../../../project/services/project.service";
import { ServerConnectService } from "../../../../core/services/server-connect/server-connect.service";
import {
  retrievedIsConfiguratorConnect,
  retrievedIsHypervisorConnect,
  retrievedIsDatasourceConnect
} from "../../../../store/server-connect/server-connect.actions";
import { retrievedVMStatus } from "../../../../store/project/project.actions";
import { selectServerConnects } from "../../../../store/server-connect/server-connect.selectors";
import { RemoteCategories } from "../../../../core/enums/remote-categories.enum";

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
  filteredServerConnect!: Observable<any[]>;
  connectionServerName = '';

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ServerConnectDialogComponent>,
    public helpers: HelpersService,
    private projectService: ProjectService,
    private serverConnectionService: ServerConnectService,
  ) {
    this.serverConnectForm = new FormGroup({
      serverConnectCtr: new FormControl('')
    });
    this.connectionServerName = this.data.connectionCategory == 'vmware_vcenter' ? 'Hypervisor' : this.data.connectionCategory == 'datasource' ? 'Datasource' : 'Configurator';
    this.selectServerConnect$ = this.store.select(selectServerConnects).subscribe(serverConnect => {
      this.serverConnect = serverConnect.filter(connection => connection.category === this.data.connectionCategory);
      this.filteredServerConnect = this.helpers.filterOptions(this.serverConnectCtr, this.serverConnect);
    });
  }

  get serverConnectCtr() { return this.serverConnectForm.get('serverConnectCtr'); };

  ngOnInit(): void {
    this.collectionId = this.projectService.getCollectionId();
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
          this.serverConnectionService.setConnection(this.data.connectionCategory, response.result);
          this.helpers.changeConnectionStatus(this.data.connectionCategory, true);
          this.projectService.get(+this.collectionId).subscribe((data: any) => {
            this.store.dispatch(retrievedVMStatus({ vmStatus: data.result.configuration.vm_status }));
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
