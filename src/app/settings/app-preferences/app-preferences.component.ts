import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { AppPrefService } from 'src/app/core/services/app-pref/app-pref.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ipInNetworkValidator } from 'src/app/shared/validations/ip-innetwork.validation';
import { ipSubnetValidation } from 'src/app/shared/validations/ip-subnet.validation';
import { loadAppPref } from 'src/app/store/app-pref/app-pref.actions';
import { selectAppPref } from 'src/app/store/app-pref/app-pref.selectors';
import { selectMapPrefs } from 'src/app/store/map-pref/map-pref.selectors';
import { HelpersService } from "../../core/services/helpers/helpers.service";

@Component({
  selector: 'app-app-preferences',
  templateUrl: './app-preferences.component.html',
  styleUrls: ['./app-preferences.component.scss']
})
export class AppPreferencesComponent implements OnInit, OnDestroy {
  appPrefForm!: FormGroup;
  selectMapPrefs$ = new Subscription();
  selectAppPref$ = new Subscription();
  errorMessages = ErrorMessages;
  listMapPref!: any[];
  appPrefDefault!: any[];
  pattern = "^[A-Za-z0-9\/\._-]*$";
  constructor(
    private toastr: ToastrService,
    private store: Store,
    private appPrefService: AppPrefService,
    public dialogRef: MatDialogRef<AppPreferencesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.selectMapPrefs$ = this.store.select(selectMapPrefs).subscribe((data: any) => {
      this.listMapPref = data;
    });
    this.selectAppPref$ = this.store.select(selectAppPref).subscribe((appPref: any) => {
      this.appPrefDefault = appPref;
    });
    this.appPrefForm = new FormGroup({
      // sessionTimeoutCtr: new FormControl('', [Validators.required]),
      mapPrefCtr: new FormControl(''),
      publicNetworkCtr: new FormControl('', [Validators.required, ipSubnetValidation(true)]),
      publicNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.public_network, "public"), ipSubnetValidation(false)]),
      privateNetworkCtr: new FormControl('', [Validators.required, ipSubnetValidation(true)]),
      privateNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.private_network , "private"), ipSubnetValidation(false)]),
      managementNetworkCtr: new FormControl('', [Validators.required, ipSubnetValidation(true)]),
      managementNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.management_network, "management"), ipSubnetValidation(false)]),
      dhcpServerCtr: new FormControl('', [Validators.pattern(this.pattern)]),
    });
    if (this.data) {
      // this.sessionTimeoutCtr?.setValue(this.data.genData.preferences.session_timeout);
      this.mapPrefCtr?.setValue(this.data.genData.default_map_pref);
      this.publicNetworkCtr?.setValue(this.data.genData.public_network);
      this.publicNetworkIPsCtr?.setValue(this.data.genData.public_reserved_ip?.map((i: any) => i.ip.trim()).join(','));
      this.privateNetworkCtr?.setValue(this.data.genData.private_network);
      this.privateNetworkIPsCtr?.setValue(this.data.genData.private_reserved_ip?.map((i: any) => i.ip.trim()).join(','));
      this.managementNetworkCtr?.setValue(this.data.genData.management_network);
      this.managementNetworkIPsCtr?.setValue(this.data.genData.management_reserved_ip?.map((i: any) => i.ip.trim()).join(','));
      this.dhcpServerCtr?.setValue(this.data.genData.management_dhcp_lease);
    }
  }

  // get sessionTimeoutCtr() { return this.appPrefForm.get('sessionTimeoutCtr'); }
  get mapPrefCtr() { return this.appPrefForm.get('mapPrefCtr'); }
  get publicNetworkCtr() { return this.appPrefForm.get('publicNetworkCtr'); }
  get publicNetworkIPsCtr() { return this.appPrefForm.get('publicNetworkIPsCtr'); }
  get privateNetworkCtr() { return this.appPrefForm.get('privateNetworkCtr'); }
  get privateNetworkIPsCtr() { return this.appPrefForm.get('privateNetworkIPsCtr'); }
  get managementNetworkCtr() { return this.appPrefForm.get('managementNetworkCtr'); }
  get managementNetworkIPsCtr() { return this.appPrefForm.get('managementNetworkIPsCtr'); }
  get dhcpServerCtr() { return this.appPrefForm.get('dhcpServerCtr'); }


  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.selectMapPrefs$.unsubscribe();
    this.selectAppPref$.unsubscribe();
  }

  processForm(data: string) {
    const arr: any[] = [];
    if (!data || data === "") {
      return []
    }else {
      const value = data.split(',');
      for (let i = 0; i < value.length; i++) {
        arr.push({
          "ip": value[i].trim(),
        })
      }
      return arr
    }
  }

  editAppPref() {
    const jsonDataValue = {
      category: this.data.genData.category,
      name: this.data.genData.name,
      // session_timeout: this.sessionTimeoutCtr?.value,
      default_map_pref: this.mapPrefCtr?.value,
      public_network: this.publicNetworkCtr?.value,
      public_reserved_ip: this.processForm(this.publicNetworkIPsCtr?.value),
      private_network: this.privateNetworkCtr?.value,
      private_reserved_ip: this.processForm(this.privateNetworkIPsCtr?.value),
      management_network: this.managementNetworkCtr?.value,
      management_reserved_ip: this.processForm(this.managementNetworkIPsCtr?.value),
      management_dhcp_lease: this.dhcpServerCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.appPrefService.put(this.data.genData.id, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(`Edit App Preferences failed due to ${error.messages}`, 'Error');
        return throwError(() => error.messages);
      })
    ).subscribe(response => {
      this.toastr.success(`Changed App Preferences`, 'Success');
      this.store.dispatch(loadAppPref());
      this.dialogRef.close();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  numericOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

}
