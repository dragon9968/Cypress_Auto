import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomainService } from "../../../core/services/domain/domain.service";
import { retrievedDomains } from "../../../store/domain/domain.actions";

@Component({
  selector: 'app-domain-bulk-edit-dialog',
  templateUrl: './domain-bulk-edit-dialog.component.html',
  styleUrls: ['./domain-bulk-edit-dialog.component.scss']
})
export class DomainBulkEditDialogComponent implements OnInit {
  domainBulkEditForm: FormGroup;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DomainBulkEditDialogComponent>,
    private domainService: DomainService
  ) {
    this.domainBulkEditForm = new FormGroup({
      adminUserCtr: new FormControl(''),
      adminPasswordCtr: new FormControl('')
    })
  }

  get adminUserCtr() { return this.domainBulkEditForm.get('adminUserCtr'); };
  get adminPasswordCtr() { return this.domainBulkEditForm.get('adminPasswordCtr'); }

  ngOnInit(): void {
  }

  editDomainBulk() {
    const pks = this.data.genData.pks;
    const adminUser = this.adminUserCtr?.value !== '' ? this.adminUserCtr?.value : undefined;
    const adminPassword = this.adminPasswordCtr?.value !== '' ? this.adminPasswordCtr?.value : undefined;
    if (adminUser || adminPassword) {
      const jsonData = {
        pks: pks,
        admin_user: this.adminUserCtr?.value !== '' ? this.adminUserCtr?.value : undefined,
        admin_password: this.adminPasswordCtr?.value !== '' ? this.adminPasswordCtr?.value : undefined
      }
      this.domainService.editBulk(jsonData).subscribe(response => {
        this.domainService.getDomainByCollectionId(this.data.genData.collectionId).subscribe(domains => {
          this.store.dispatch(retrievedDomains({ data: domains.result }));
        });
        this.dialogRef.close();
        this.toastr.success(response.message, 'Success');
      })
    } else {
      this.dialogRef.close();
      this.toastr.info('You\'re not updating anything in the bulk edit domains', 'Info');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
