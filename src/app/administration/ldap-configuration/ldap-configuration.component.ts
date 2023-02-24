import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { LdapConfigService } from 'src/app/core/services/ldap-config/ldap-config.service';

@Component({
  selector: 'app-ldap-configuration',
  templateUrl: './ldap-configuration.component.html',
  styleUrls: ['./ldap-configuration.component.scss']
})
export class LDAPConfigurationComponent implements OnInit {
  configForm!: FormGroup;
  public showPassword: boolean = false;
  constructor(
    private toastr: ToastrService,
    private ldapConfigService: LdapConfigService,
    public dialogRef: MatDialogRef<LDAPConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.configForm = new FormGroup({
      authLdapServerCtr: new FormControl(''),
      authLdapUseTlsCtr: new FormControl(''),
      authLdapAllowSelfSignedCtr: new FormControl(''),
      authLdapTlsCacertfileCtr: new FormControl(''),
      authUserRegistrationCtr: new FormControl(true),
      permanentSessionLifetimeCtr: new FormControl('1800'),
      authUserRegistrationRoleCtr: new FormControl('Public'),
      authLdapFirstnameFieldCtr: new FormControl('cn'),
      authLdapLastnameFieldCtr: new FormControl('sn'),
      authLdapEmailFieldCtr: new FormControl('mail'),
      authLdapSearchCtr: new FormControl(''),
      authLdapGroupFieldCtr: new FormControl('memberOf'),
      authLdapUidFieldCtr: new FormControl('uid'),
      authLdapBindUserCtr: new FormControl(''),
      authLdapBindPasswordCtr: new FormControl(''),
      ldapBaseDnCtr: new FormControl(''),
      ldapDefaultUserGroupCtr: new FormControl(''),
      ldapDefaultAdminGroupCtr: new FormControl(''),
    })
   }

  get authLdapServerCtr() { return this.configForm.get('authLdapServerCtr'); }
  get authLdapUseTlsCtr() { return this.configForm.get('authLdapUseTlsCtr'); }
  get authLdapAllowSelfSignedCtr() { return this.configForm.get('authLdapAllowSelfSignedCtr'); }
  get authLdapTlsCacertfileCtr() { return this.configForm.get('authLdapTlsCacertfileCtr'); }
  get authUserRegistrationCtr() { return this.configForm.get('authUserRegistrationCtr'); }
  get permanentSessionLifetimeCtr() { return this.configForm.get('permanentSessionLifetimeCtr'); }
  get authUserRegistrationRoleCtr() { return this.configForm.get('authUserRegistrationRoleCtr'); }
  get authLdapFirstnameFieldCtr() { return this.configForm.get('authLdapFirstnameFieldCtr'); }
  get authLdapLastnameFieldCtr() { return this.configForm.get('authLdapLastnameFieldCtr'); }
  get authLdapEmailFieldCtr() { return this.configForm.get('authLdapEmailFieldCtr'); }
  get authLdapSearchCtr() { return this.configForm.get('authLdapSearchCtr'); }
  get authLdapGroupFieldCtr() { return this.configForm.get('authLdapGroupFieldCtr'); }
  get authLdapUidFieldCtr() { return this.configForm.get('authLdapUidFieldCtr'); }
  get authLdapBindUserCtr() { return this.configForm.get('authLdapBindUserCtr'); }
  get authLdapBindPasswordCtr() { return this.configForm.get('authLdapBindPasswordCtr'); }
  get ldapBaseDnCtr() { return this.configForm.get('ldapBaseDnCtr'); }
  get ldapDefaultUserGroupCtr() { return this.configForm.get('ldapDefaultUserGroupCtr'); }
  get ldapDefaultAdminGroupCtr() { return this.configForm.get('ldapDefaultAdminGroupCtr'); }

  ngOnInit(): void {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onCancel() {
    this.dialogRef.close();
  }

  updateConfig() {
    if (this.configForm.valid) {
      const JsonData = {
        auth_ldap_server: this.authLdapServerCtr?.value,
        auth_ldap_use_tls: this.authLdapUseTlsCtr?.value,
        auth_ldap_allow_self_signed: this.authLdapAllowSelfSignedCtr?.value,
        auth_ldap_tls_cacertfile: this.authLdapTlsCacertfileCtr?.value,
        auth_user_registration: this.authUserRegistrationCtr?.value,
        permanent_session_lifetime: this.permanentSessionLifetimeCtr?.value,
        auth_user_registration_role: this.authUserRegistrationRoleCtr?.value,
        auth_ldap_firstname_field: this.authLdapFirstnameFieldCtr?.value,
        auth_ldap_lastname_field: this.authLdapLastnameFieldCtr?.value,
        auth_ldap_email_field: this.authLdapEmailFieldCtr?.value,
        auth_ldap_search: this.authLdapSearchCtr?.value,
        auth_ldap_group_field: this.authLdapGroupFieldCtr?.value,
        auth_ldap_uid_field: this.authLdapUidFieldCtr?.value,
        auth_ldap_bind_user: this.authLdapBindUserCtr?.value,
        auth_ldap_bind_password: this.authLdapBindPasswordCtr?.value,
        ldap_base_dn: this.ldapBaseDnCtr?.value,
        ldap_default_user_group: this.ldapDefaultUserGroupCtr?.value,
        ldap_default_admin_group: this.ldapDefaultAdminGroupCtr?.value
      }
      this.ldapConfigService.updateConfig(JsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe(() => {
        this.dialogRef.close();
        this.toastr.success(`Updated LDAP Configuration`)
      })
    }
  }
  

}
