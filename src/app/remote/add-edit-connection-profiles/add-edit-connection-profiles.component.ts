import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { selectServerConnect } from 'src/app/store/server-connect/server-connect.selectors';

@Component({
  selector: 'app-add-edit-connection-profiles',
  templateUrl: './add-edit-connection-profiles.component.html',
  styleUrls: ['./add-edit-connection-profiles.component.scss']
})
export class AddEditConnectionProfilesComponent implements OnInit {
  id: any;
  isViewMode: boolean = false;
  connectionForm?: FormGroup; 
  selectServerConnect$ = new Subscription();
  listConnect!: any[];
  constructor(
    private formBuilder: FormBuilder,
    private serverConnectService: ServerConnectService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.selectServerConnect$ = this.store.select(selectServerConnect).subscribe((data: any) => {
      this.listConnect = data;
      this.id = this.route.snapshot.params['id'];
      this.isViewMode = !this.id;
      if (data) {
        if (!this.isViewMode) {
          data = data.filter((obj: any)=>{if(obj.id==this.id){return obj}}); 
          this.name?.setValue(data[0].name);
          this.category?.setValue(data[0].category);
          if (data[0].parameters) {
            this.server?.setValue(data[0].parameters.server);
            this.dataCenter?.setValue(data[0].parameters.datacenter);
            this.cluster?.setValue(data[0].parameters.cluster);
            this.dataStore?.setValue(data[0].parameters.datastore);
            this.switch?.setValue(data[0].parameters.switch);
            this.switchType?.setValue(data[0].parameters.switch_type);
            this.managementNetwork?.setValue(data[0].parameters.management_network);
            this.username?.setValue(data[0].parameters.username);
            this.password?.setValue(data[0].parameters.password);
            this.update_password?.setValue('update');
          }
        }
      }
    });
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
   get update_password() {return this.connectionForm?.get('update_password');}

  ngOnInit(): void {
    this.connectionForm =  this.formBuilder.group({
      name: [''],
      category: [ 'vmware_vcenter', [Validators.required]],
      server: [''],
      dataCenter: [''],
      cluster: [''],
      dataStore: [''],
      switch: [''],
      switchType: ['vswitch'],
      managementNetwork: [''],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      update_password: ['']
    })
    if (!this.isViewMode) {
      this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
    }
  }

  onSubmit() {
    if (this.isViewMode) {
      this.addServerConnect();
    }else {
      this.updateServerConnect();
    }
  }

  onCancle() {
    this.router.navigate([RouteSegments.CONNECTION_PROFILES]);
  }

  addServerConnect() {
    if (this.connectionForm?.valid) {
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
        password: this.password?.value,
      }
      this.serverConnectService.add(jsonData).subscribe({
        next:(rest) => {
          this.toastr.success(`Created Connection ${rest.result.name} successfully`);
          setTimeout(() => {
            this.router.navigate([RouteSegments.CONNECTION_PROFILES]);
          }, 1000);
        },
        error:(err) => {
          this.toastr.error(`Error while add connection ${err.result.name}`);
        }
      });
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
      update_password: this.update_password?.value
    }
    this.serverConnectService.put(this.id, jsonData).subscribe(
      (response: any) => {
        this.toastr.success(`Updated Connection ${response.result.name}`);
        this.router.navigate([RouteSegments.CONNECTION_PROFILES]);
      }
    )
  }
}
