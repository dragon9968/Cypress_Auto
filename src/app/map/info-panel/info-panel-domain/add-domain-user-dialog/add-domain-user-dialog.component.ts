import { ToastrService } from "ngx-toastr";
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { DomainService } from "../../../../core/services/domain/domain.service";

@Component({
  selector: 'app-add-domain-user-dialog',
  templateUrl: './add-domain-user-dialog.component.html',
  styleUrls: ['./add-domain-user-dialog.component.scss']
})
export class AddDomainUserDialogComponent implements OnInit {
  addDomainUserForm: FormGroup;
  errorMessages = ErrorMessages;

  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddDomainUserDialogComponent>,
    private domainService: DomainService
  ) {
    this.addDomainUserForm = new FormGroup({
      numberUserCtr: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$') ]),
      userPasswordCtr: new FormControl('')
    })
  }

  get numberUserCtr() { return this.addDomainUserForm.get('numberUserCtr'); }
  get userPasswordCtr() { return this.addDomainUserForm.get('userPasswordCtr'); }

  ngOnInit(): void {
    this.userPasswordCtr?.setValue('P@ssw0rd123');
  }

  onCancel() {
    this.dialogRef.close()
  }

  addDomainUsers() {
    const jsonData = {
      domain_id: this.data.genData.domainId,
      number_user: Number(this.numberUserCtr?.value),
      user_password: this.userPasswordCtr?.value
    }
    this.domainService.addDomainUser(jsonData).subscribe(response => {
      this.toastr.success(response.message);
      this.dialogRef.close();
    })
  }
}
