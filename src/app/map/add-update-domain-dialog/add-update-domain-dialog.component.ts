import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HelpersService } from "../../core/services/helpers/helpers.service";
import { ErrorMessages } from "../../shared/enums/error-messages.enum";
import { selectDomains } from "../../store/domain/domain.selectors";
import { addDomain, updateDomain } from "../../store/domain/domain.actions";
import { validateNameExist } from "../../shared/validations/name-exist.validation";
import { selectNotification } from "src/app/store/app/app.selectors";


@Component({
  selector: 'app-add-update-domain-dialog',
  templateUrl: './add-update-domain-dialog.component.html',
  styleUrls: ['./add-update-domain-dialog.component.scss']
})
export class AddUpdateDomainDialogComponent implements OnInit {
  domainAddForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomains$ = new Subscription();
  selectNotification$ = new Subscription();
  domains!: any[];
  isViewMode = false;

  constructor(
    private store: Store,
    public helpers: HelpersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateDomainDialogComponent>,
  ) {
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification?.type == 'success') {
        this.dialogRef.close();
      }
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any[]) => {
      this.domains = domains;
    })
    this.isViewMode = this.data.mode == 'view';
    this.domainAddForm = new FormGroup({
      nameCtr: new FormControl('',
        [Validators.required, validateNameExist(() => this.domains, this.data.mode, this.data.genData.id)]
      ),
      adminUserCtr: new FormControl(''),
      adminPasswordCtr: new FormControl('')
    })
  }

  get nameCtr() { return this.domainAddForm.get('nameCtr'); }
  get adminUserCtr() { return this.domainAddForm.get('adminUserCtr'); }
  get adminPasswordCtr() { return this.domainAddForm.get('adminPasswordCtr'); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.adminUserCtr?.setValue(this.data.genData.admin_user);
    this.adminPasswordCtr?.setValue(this.data.genData.admin_password);
    this.nameCtr?.setValidators([Validators.pattern('[^_]*')])
  }

  addDomain() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      project_id: this.data.genData.project_id,
      admin_user: this.adminUserCtr?.value,
      admin_password: this.adminPasswordCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(addDomain({ data: jsonData }));
  }

  updateDomain() {
    const jsonDataValue = {
      name: this.nameCtr?.value,
      admin_user: this.adminUserCtr?.value,
      admin_password: this.adminPasswordCtr?.value
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.store.dispatch(updateDomain({ id: this.data.genData.id, data: jsonData }));
  }

  onCancel() {
    this.dialogRef.close();
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }
}
