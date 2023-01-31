import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';

@Component({
  selector: 'app-add-edit-connection-profiles',
  templateUrl: './add-edit-connection-profiles.component.html',
  styleUrls: ['./add-edit-connection-profiles.component.scss']
})
export class AddEditConnectionProfilesComponent implements OnInit {
  id: any;
  isViewMode = false;
  isChecked = false;
  isHiddenField = false;
  isHiddenDeleteButton = false;
  selectedFile: any = null;
  connectionForm?: FormGroup;
  errorMessages = ErrorMessages;
  public showPassword: boolean = false;
  constructor(
    private serverConnectService: ServerConnectService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditConnectionProfilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.connectionForm =  new FormGroup({
      name: new FormControl({value: '', disabled: this.isViewMode}),
      category: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      server: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      dataCenter: new FormControl({value: '', disabled: this.isViewMode}),
      cluster: new FormControl({value: '', disabled: this.isViewMode}),
      dataStore: new FormControl({value: '', disabled: this.isViewMode}),
      switch: new FormControl({value: '', disabled: this.isViewMode}),
      switchType: new FormControl({value: '', disabled: this.isViewMode}),
      managementNetwork: new FormControl({value: '', disabled: this.isViewMode}),
      username: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      password: new FormControl({value: '', disabled: this.isViewMode}),
      updatePassword: new FormControl({value: '', disabled: this.isViewMode}),
      file: new FormControl({value: '', disabled: this.isViewMode}),
      certFile: new FormControl({value: '', disabled: this.isViewMode})
    })
   }

   get name() { return this.connectionForm?.get('name'); }
   get category() { return this.connectionForm?.get('category'); }
   get server() { return this.connectionForm?.get('server'); }
   get dataCenter() { return this.connectionForm?.get('dataCenter'); }
   get cluster() { return this.connectionForm?.get('cluster'); }
   get dataStore() { return this.connectionForm?.get('dataStore'); }
   get switch() { return this.connectionForm?.get('switch'); }
   get switchType() { return this.connectionForm?.get('switchType'); }
   get managementNetwork() { return this.connectionForm?.get('managementNetwork'); }
   get username() { return this.connectionForm?.get('username'); }
   get password() { return this.connectionForm?.get('password'); }
   get updatePassword() {return this.connectionForm?.get('updatePassword');}
   get file() {return this.connectionForm?.get('file');}
   get certFile() {return this.connectionForm?.get('certFile');}

  ngOnInit(): void {
    if (this.data.mode === 'view') {
      this.name?.setValue(this.data.genData.name)
      this.category?.setValue(this.data.genData.category)
      this.server?.setValue(this.data.genData.parameters.server === '' ? 'None' : this.data.genData.parameters.server);
      this.certFile?.setValue(this.data.genData.parameters.cert_file === '' ? 'None' : this.data.genData.parameters.cert_file);
      this.dataCenter?.setValue(this.data.genData.parameters.datacenter === '' ? 'None' : this.data.genData.parameters.datacenter);
      this.cluster?.setValue(this.data.genData.parameters.cluster === '' ? 'None' : this.data.genData.parameters.cluster);
      this.dataStore?.setValue(this.data.genData.parameters.datastore === '' ? 'None' : this.data.genData.parameters.datastore);
      this.switch?.setValue(this.data.genData.parameters.switch === '' ? 'None' : this.data.genData.parameters.switch);
      this.switchType?.setValue(this.data.genData.parameters.switch_type === '' ? 'None' : this.data.genData.parameters.switch_type);
      this.managementNetwork?.setValue(this.data.genData.parameters.management_network === '' ? 'None' : this.data.genData.parameters.management_network);
      this.username?.setValue(this.data.genData.parameters.username === '' ? 'None' : this.data.genData.parameters.username);
    } else {
        this.isHiddenDeleteButton = true;
        this.name?.setValue(this.data.genData.name)
        this.category?.setValue(this.data.genData.category)
        this.server?.setValue(this.data.genData.parameters.server);
        this.dataCenter?.setValue(this.data.genData.parameters.datacenter);
        this.cluster?.setValue(this.data.genData.parameters.cluster);
        this.dataStore?.setValue(this.data.genData.parameters.datastore);
        this.switch?.setValue(this.data.genData.parameters.switch);
        this.switchType?.setValue(this.data.genData.parameters.switch_type);
        this.managementNetwork?.setValue(this.data.genData.parameters.management_network);
        this.username?.setValue(this.data.genData.parameters.username);
        this.password?.setValue(this.data.genData.parameters.password);
        if (this.data.genData.category === 'datasource') {
          this.isHiddenField = true;
          this.certFile?.setValue(this.data.genData.parameters.cert_file);
          if (this.data.genData.parameters.cert_file === '') {
            this.isHiddenDeleteButton = true;
          } else {
            this.isHiddenDeleteButton = false;
          }
        }
        if (this.data.mode === 'add') {
          this.password?.setValidators([Validators.required]);
        }
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSelectChange(event: any) {
    if (event === "vmware_vcenter") {
      this.isHiddenField = false;
    } else {
      this.isHiddenField = true;
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
    
  }

  onSelectChangeDelete(event: any) {
    if (event.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  addServerConnect() {
    if (this.connectionForm?.valid) {
      const jsonData = {
        name: this.name?.value,
        category: this.category?.value,
        server: this.server?.value,
        cert_file: '',
        datacenter: this.dataCenter?.value,
        cluster: this.cluster?.value,
        datastore: this.dataStore?.value,
        switch: this.switch?.value,
        switch_type: this.switchType?.value,
        management_network: this.managementNetwork?.value,
        username: this.username?.value,
        password: this.password?.value,
      }
      if (this.category?.value === 'vmware_vcenter') {
        this.serverConnectService.add(jsonData).subscribe({
          next:(rest) => {
            this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
            this.toastr.success(`Created Connection ${rest.result.name} successfully`);
            this.dialogRef.close();
          },
          error:(err) => {
            this.toastr.error(`Error while add connection ${err.result.name}`);
          }
        });
      } else {
        this.serverConnectService.add(jsonData).pipe(
          catchError((e: any) => {
            this.toastr.error(e.error.message);
            return throwError(() => e);
          })
        ).subscribe((respData: any) => {
          this.serverConnectService.get(respData.id).subscribe(respData => {
            const formData = new FormData();
            formData.append('file', this.selectedFile);
            formData.append('pk', respData.id);
            this.serverConnectService.updateFile(formData).subscribe(respData => {
              this.toastr.success(`Add Connection successfully`)
              this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
              this.dialogRef.close();
            });
          })
        })
      }
    }
  }

  updateServerConnect() {
    const jsonData = {
      name: this.name?.value,
      category: this.category?.value,
      server: this.server?.value,
      datacenter: this.dataCenter?.value,
      cluster: this.cluster?.value,
      datastore: this.dataStore?.value,
      switch: this.switch?.value,
      switch_type: this.switchType?.value,
      management_network: this.managementNetwork?.value,
      username: this.username?.value,
      update_password: this.updatePassword?.value
    }
    this.serverConnectService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe((respData: any) => {
      if (this.selectedFile || this.isChecked) {
        this.serverConnectService.get(this.data.genData.id).subscribe(respData => {
          const formData = new FormData();
          formData.append('file', this.selectedFile);
          formData.append('pk', this.data.genData.id);
          if (this.isChecked) {
            formData.append('checked', 'true');
          }
          else {
            formData.append('checked', 'false');
          }
          this.serverConnectService.updateFile(formData).subscribe(respData => {
            this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
            this.toastr.success(`Updated Connection successfully`)
            this.dialogRef.close();
          });
        })
      } else {
        this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
        this.toastr.success(`Updated Connection successfully`)
        this.dialogRef.close();
      }
    })
  }
}
