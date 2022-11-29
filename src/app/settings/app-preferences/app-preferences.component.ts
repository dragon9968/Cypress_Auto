import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { AppPrefService } from 'src/app/core/services/app-pref/app-pref.service';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ipInNetworkValidator } from 'src/app/shared/validations/ip-innetwork.validation';
import { ipValidator } from 'src/app/shared/validations/ip.validation';
import { selectAppPref } from 'src/app/store/app-pref/app-pref.selectors';
import { retrievedMapPrefs } from 'src/app/store/map-pref/map-pref.actions';
import { selectMapPrefs } from 'src/app/store/map-pref/map-pref.selectors';

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
  constructor(
    private toastr: ToastrService,
    private store: Store,
    private mapPrefService: MapPrefService,
    private appPrefService: AppPrefService,
    public dialogRef: MatDialogRef<AppPreferencesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.selectMapPrefs$ = this.store.select(selectMapPrefs).subscribe((data: any) => {
      this.listMapPref = data;
    });
    this.selectAppPref$ = this.store.select(selectAppPref).subscribe((appPref: any) => {
      this.appPrefDefault = appPref;
    });
    this.appPrefForm = new FormGroup({
      sessionTimeoutCtr: new FormControl('', [Validators.required]),
      mapPrefCtr: new FormControl(''),
      publicNetworkCtr: new FormControl('', [ipValidator(true)]),
      publicNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.preferences.public_network), ipValidator(false)]),
      privateNetworkCtr: new FormControl('', [ipValidator(true)]),
      privateNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.preferences.network), ipValidator(false)]),
      managementNetworkCtr: new FormControl('', [ipValidator(true)]),
      managementNetworkIPsCtr: new FormControl('', [ipInNetworkValidator(this.data.genData.preferences.management_network), ipValidator(false)]),
      dhcpServerCtr: new FormControl(''),
    });

    if (this.data) {
      this.sessionTimeoutCtr?.setValue(this.data.genData.preferences.session_timeout);
      this.mapPrefCtr?.setValue(this.data.genData.preferences.map_preferences);
      this.publicNetworkCtr?.setValue(this.data.genData.preferences.public_network);
      this.publicNetworkIPsCtr?.setValue(this.data.genData.preferences.reserved_ip.map((i: any) => i.ip).join(','));
      this.privateNetworkCtr?.setValue(this.data.genData.preferences.network);
      this.privateNetworkIPsCtr?.setValue(this.data.genData.preferences.private_reserved_ip.map((i: any) => i.ip).join(','));
      this.managementNetworkCtr?.setValue(this.data.genData.preferences.management_network);
      this.managementNetworkIPsCtr?.setValue(this.data.genData.preferences.management_reserved_ip.map((i: any) => i.ip).join(','));
      this.dhcpServerCtr?.setValue(this.data.genData.preferences.management_dhcp_lease);
    }
  }

  get sessionTimeoutCtr() { return this.appPrefForm.get('sessionTimeoutCtr'); }
  get mapPrefCtr() { return this.appPrefForm.get('mapPrefCtr'); }
  get publicNetworkCtr() { return this.appPrefForm.get('publicNetworkCtr'); }
  get publicNetworkIPsCtr() { return this.appPrefForm.get('publicNetworkIPsCtr'); }
  get privateNetworkCtr() { return this.appPrefForm.get('privateNetworkCtr'); }
  get privateNetworkIPsCtr() { return this.appPrefForm.get('privateNetworkIPsCtr'); }
  get managementNetworkCtr() { return this.appPrefForm.get('managementNetworkCtr'); }
  get managementNetworkIPsCtr() { return this.appPrefForm.get('managementNetworkIPsCtr'); }
  get dhcpServerCtr() { return this.appPrefForm.get('dhcpServerCtr'); }
  

  ngOnInit(): void {
    this.mapPrefService.getAll().subscribe((data: any) => this.store.dispatch(retrievedMapPrefs({data: data.result})));
  }

  ngOnDestroy(): void {
    this.selectMapPrefs$.unsubscribe();
    this.selectAppPref$.unsubscribe();
  }

  processForm(data: string) {
    const arr: any[] = [];
    if (data === "") {
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
    const jsonData = {
      category: this.data.genData.category,
      name: this.data.genData.name,
      session_timeout: this.sessionTimeoutCtr?.value,
      map_preferences: this.mapPrefCtr?.value,
      public_network: this.publicNetworkCtr?.value,
      public_reserved_ip: this.processForm(this.publicNetworkIPsCtr?.value),
      private_network: this.privateNetworkCtr?.value,
      private_reserved_ip: this.processForm(this.privateNetworkIPsCtr?.value),
      management_network: this.managementNetworkCtr?.value,
      management_reserved_ip: this.processForm(this.managementNetworkIPsCtr?.value),
      management_dhcp_lease: this.dhcpServerCtr?.value,
    }
    this.appPrefService.put(this.data.genData.id, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error(`Edit App Preferences failed due to ${error.messages}`, 'Error');
        return throwError(() => error.messages);
      })
    ).subscribe(response => {
      this.toastr.success(`Changed App Preferences`, 'Success');
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
