import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { ServerConnectService } from 'src/app/core/services/server-connect/server-connect.service';
import { retrievedServerConnect } from 'src/app/store/server-connect/server-connect.actions';
import { selectServerConnects } from 'src/app/store/server-connect/server-connect.selectors';

@Component({
  selector: 'app-show-connection-profiles',
  templateUrl: './show-connection-profiles.component.html',
  styleUrls: ['./show-connection-profiles.component.scss']
})
export class ShowConnectionProfilesComponent implements OnInit {
  id: any;
  connect!: any[];
  selectServerConnect$ = new Subscription();
  connectionForm!: FormGroup;
  listConnect!: any[];
  constructor(
    private formBuilder: FormBuilder,
    private serverConnectService: ServerConnectService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.selectServerConnect$ = this.store.select(selectServerConnects).subscribe((data: any) => {
      this.listConnect = data;
      this.route.paramMap.subscribe(params => {
        this.id = params.get('id');
      });
      this.connectionForm =  this.formBuilder.group({
        name: [''],
        category: [''],
        server: ['None'],
        certfile: ["None"],
        dataCenter: ['None'],
        cluster: ['None'],
        dataStore: ['None'],
        switch: ['None'],
        switchType: ['None'],
        managementNetwork: ['None'],
        username: ['None'],
      })

      if (data) {
        data = data.filter((obj: any)=>{if(obj.id==this.id){return obj}});
        this.name?.setValue(data[0].name);
        this.category?.setValue(data[0].category);
        if (data[0].parameters) {
          this.server?.setValue(data[0].parameters.server === null ? 'None' : data[0].parameters.server);
          this.certfile?.setValue(data[0].parameters.cert_file === null ? 'None' : data[0].parameters.cert_file);
          this.dataCenter?.setValue(data[0].parameters.datacenter === null ? 'None' : data[0].parameters.datacenter);
          this.cluster?.setValue(data[0].parameters.cluster === null ? 'None' : data[0].parameters.cluster);
          this.dataStore?.setValue(data[0].parameters.datastore === null ? 'None' : data[0].parameters.datastore);
          this.switch?.setValue(data[0].parameters.switch === null ? 'None' : data[0].parameters.switch);
          this.switchType?.setValue(data[0].parameters.switch_type === null ? 'None' : data[0].parameters.switch_type);
          this.managementNetwork?.setValue(data[0].parameters.management_network === null ? 'None' : data[0].parameters.management_network);
          this.username?.setValue(data[0].parameters.username === null ? 'None' : data[0].parameters.username);
        }
      }
    });
  }

  get name() { return this.connectionForm?.get('name'); }
  get category() { return this.connectionForm?.get('category'); }
  get server() { return this.connectionForm?.get('server'); }
  get certfile() { return this.connectionForm?.get('certfile'); }
  get dataCenter() { return this.connectionForm?.get('dataCenter'); }
  get cluster() { return this.connectionForm?.get('cluster'); }
  get dataStore() { return this.connectionForm?.get('dataStore'); }
  get switch() { return this.connectionForm?.get('switch'); }
  get switchType() { return this.connectionForm?.get('switchType'); }
  get managementNetwork() { return this.connectionForm?.get('managementNetwork'); }
  get username() { return this.connectionForm?.get('username'); }

  ngOnInit(): void {
    this.serverConnectService.getAll().subscribe((data: any) => this.store.dispatch(retrievedServerConnect({data: data.result})));
  }

  closePage() {
    this.router.navigate([RouteSegments.CONNECTION_PROFILES]);
  }
}
