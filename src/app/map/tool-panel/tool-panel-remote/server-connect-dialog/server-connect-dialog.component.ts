import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HelpersService } from "../../../../core/services/helpers/helpers.service";
import { selectServerConnect } from "../../../../store/server-connect/server-connect.selectors";
import { ActivatedRoute, Params } from "@angular/router";

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ServerConnectDialogComponent>,
    public helpers: HelpersService,
  ) {
    this.selectServerConnect$ = this.store.select(selectServerConnect).subscribe(serverConnect => {
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
    console.log('Connect to Server');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
