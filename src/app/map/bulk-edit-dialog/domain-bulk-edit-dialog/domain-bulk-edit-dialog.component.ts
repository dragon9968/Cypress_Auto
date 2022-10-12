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
    const jsonData = {
      pks: this.data.genData.pks,
      admin_user: this.adminUserCtr?.value,
      admin_password: this.adminPasswordCtr?.value
    }
    this.domainService.editBulk(jsonData).subscribe(response => {
      this.toastr.success(response.message);
      this.domainService.getDomainByCollectionId(this.data.genData.collectionId).subscribe(domains => {
        this.store.dispatch(retrievedDomains({ data: domains.result }));
      });
      this.dialogRef.close();
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
