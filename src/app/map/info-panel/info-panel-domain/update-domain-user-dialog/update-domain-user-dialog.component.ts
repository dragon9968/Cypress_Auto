import { Store } from "@ngrx/store";
import { ToastrService } from "ngx-toastr";
import { Subscription, throwError } from "rxjs";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { ErrorMessages } from "../../../../shared/enums/error-messages.enum";
import { DomainUserService } from "../../../../core/services/domain-user/domain-user.service";
import { validateNameExist } from "../../../../shared/validations/name-exist.validation";
import { selectDomainUsers } from "../../../../store/domain-user/domain-user.selectors";
import { retrievedIsChangeDomainUsers } from "../../../../store/domain-user-change/domain-user-change.actions";

@Component({
  selector: 'app-update-domain-user-dialog',
  templateUrl: './update-domain-user-dialog.component.html',
  styleUrls: ['./update-domain-user-dialog.component.scss']
})
export class UpdateDomainUserDialogComponent implements OnInit, OnDestroy {
  updateDomainUserForm: FormGroup;
  errorMessages = ErrorMessages;
  selectDomainUsers$ = new Subscription();
  domainUsers: any[] = [];

  constructor(
    private store: Store,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UpdateDomainUserDialogComponent>,
    private domainUserService: DomainUserService
  ) {
    this.selectDomainUsers$ = this.store.select(selectDomainUsers).subscribe(domainUsers => {
        if (domainUsers) {
          this.domainUsers = domainUsers
        }
      }
    )
    this.updateDomainUserForm = new FormGroup({
      firstnameCtr: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      lastnameCtr: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('[a-zA-Z ]*')
      ]),
      usernameCtr: new FormControl('', [
        Validators.required, validateNameExist(() => this.domainUsers, 'update', this.data.genData.id, 'username')]),
      passwordCtr: new FormControl(''),
      companyCtr: new FormControl(''),
      upnCtr: new FormControl('', [Validators.required]),
      emailCtr: new FormControl(''),
      streetAddressCtr: new FormControl(''),
      cityCtr: new FormControl(''),
      stateProvinceCtr: new FormControl(''),
      postalCodeCtr: new FormControl('', [Validators.pattern('^[0-9]*$')]),
      countryCtr: new FormControl('')
    })
  }

  get firstnameCtr() { return this.updateDomainUserForm.get('firstnameCtr'); }
  get lastnameCtr() { return this.updateDomainUserForm.get('lastnameCtr'); }
  get usernameCtr() { return this.updateDomainUserForm.get('usernameCtr'); }
  get passwordCtr() { return this.updateDomainUserForm.get('passwordCtr'); }
  get companyCtr() { return this.updateDomainUserForm.get('companyCtr'); }
  get upnCtr() { return this.updateDomainUserForm.get('upnCtr'); }
  get emailCtr() { return this.updateDomainUserForm.get('emailCtr'); }
  get streetAddressCtr() { return this.updateDomainUserForm.get('streetAddressCtr'); }
  get cityCtr() { return this.updateDomainUserForm.get('cityCtr'); }
  get stateProvinceCtr() { return this.updateDomainUserForm.get('stateProvinceCtr'); }
  get postalCodeCtr() { return this.updateDomainUserForm.get('postalCodeCtr'); }
  get countryCtr() { return this.updateDomainUserForm.get('countryCtr'); }

  ngOnInit(): void {
    this.firstnameCtr?.setValue(this.data.genData.firstname);
    this.lastnameCtr?.setValue(this.data.genData.lastname);
    this.usernameCtr?.setValue(this.data.genData.username);
    this.passwordCtr?.setValue(this.data.genData.configuration?.password ? this.data.genData.configuration?.password : 'P@ssw0rd123');
    this.companyCtr?.setValue(this.data.genData.configuration?.company);
    this.upnCtr?.setValue(
      this.data.genData.configuration?.upn ? this.data.genData.configuration?.upn : `${this.data.genData.username}@${this.data.domain.name}`
    );
    this.emailCtr?.setValue(this.data.genData.configuration?.email);
    this.streetAddressCtr?.setValue(this.data.genData.configuration?.address?.street);
    this.cityCtr?.setValue(this.data.genData.configuration?.address?.city);
    this.stateProvinceCtr?.setValue(this.data.genData.configuration?.address?.state_province);
    this.postalCodeCtr?.setValue(this.data.genData.configuration?.address?.postal_code);
    this.countryCtr?.setValue(this.data.genData.configuration?.address?.country);
  }

  updateDomainUser() {
    const jsonData = {
      firstname: this.firstnameCtr?.value,
      lastname: this.lastnameCtr?.value,
      username: this.usernameCtr?.value,
      password: this.passwordCtr?.value,
      company: this.companyCtr?.value,
      upn: this.upnCtr?.value,
      email: this.emailCtr?.value,
      street_address: this.streetAddressCtr?.value,
      city: this.cityCtr?.value,
      state_province: this.stateProvinceCtr?.value,
      postal_code: this.postalCodeCtr?.value?.toString(),
      country: this.countryCtr?.value,
    }
    this.domainUserService.put(this.data.genData.id, jsonData).subscribe({
      next: response => {
        this.store.dispatch(retrievedIsChangeDomainUsers({isChangeDomainUsers: true}));
        this.toastr.success('Updated Row');
        this.dialogRef.close();
      },
      error: err => {
        this.toastr.error('Update Row Failed');
        throwError(() => err);
      }
    })
  }

  ngOnDestroy(): void {
    this.selectDomainUsers$.unsubscribe();
  }

}
