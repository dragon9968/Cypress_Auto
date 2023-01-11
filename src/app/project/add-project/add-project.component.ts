import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, Subscription, throwError } from "rxjs";
import { Store } from '@ngrx/store';
import { ToastrService } from "ngx-toastr";
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/project/services/project.service';
import { selectProjects } from 'src/app/store/project/project.selectors';
import { retrievedProjects } from 'src/app/store/project/project.actions';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { AgGridAngular } from 'ag-grid-angular';
import { AppPrefService } from 'src/app/core/services/app-pref/app-pref.service';
import { ColDef, GridApi, GridReadyEvent, ValueSetterParams } from 'ag-grid-community';
import { ButtonRenderersComponent } from '../renderers/button-renderers-component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectAppPref } from 'src/app/store/app-pref/app-pref.selectors';
import { retrievedAppPref } from 'src/app/store/app-pref/app-pref.actions';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  isSubmitBtnDisabled = false;
  selectAppPref$ = new Subscription();
  labelPosition = 'blank';
  projectForm!: FormGroup;
  routeSegments = RouteSegments;
  errorMessages = ErrorMessages;
  selectProjects$ = new Subscription();
  nameProject!: any[];
  rowData!: any[];
  isDisableButton = false;
  appPrefDefault!: any[];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    editable: true,
  };
  columnDefs: ColDef[] = [
    { headerName: '',
      editable: false,
      maxWidth: 90,
      cellRenderer: ButtonRenderersComponent,
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
      }
    },
    { field: 'category',
      valueFormatter: (params) => params.value,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['public', 'private', 'management'],
      },
    },
    { field: 'network',
      valueSetter: this.setterValueNetwork.bind(this),
    },
    { field: 'reserved_ip',
      headerName: 'Reserved IP Addresses',
      autoHeight: true,
      valueGetter: function(params) {
        if (Array.isArray(params.data.reserved_ip)) {
          return params.data.reserved_ip.map((cat: any) => cat.ip).join(',');
        }
        return params.data.reserved_ip;
      },
      valueSetter: this.setterValueNetwork.bind(this),
      cellRenderer: function(params: any) {
        return params.value ? `[${params.value}]` : '[]'
      }
    }
  ];

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router,
    private appPrefService: AppPrefService,
    private dialog: MatDialog,
    private helpers: HelpersService
  ) {
    this.selectProjects$ = this.store.select(selectProjects).subscribe(nameProject => {
      this.nameProject = nameProject;
    })
    this.selectAppPref$ = this.store.select(selectAppPref).subscribe((data: any)=> {
      if (data) {
        let pubNetwork = {
          "network": data.preferences.public_network ? data.preferences.public_network : "10.0.0.0/8",
          "category": "public",
          "reserved_ip": data.preferences.reserved_ip
        }
        let privNetwork = {
          "network": data.preferences.network ? data.preferences.network : "192.168.0.0/16",
          "category": "private",
          "reserved_ip": data.preferences.private_reserved_ip
        }
        let manNetwork = {
          "network": data.preferences.management_network ? data.preferences.management_network : "172.16.0.0/22",
          "category": "management",
          "reserved_ip": data.preferences.management_reserved_ip
        }
        this.rowData = [pubNetwork, privNetwork, manNetwork]
      }
    })
  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name : ['',
        [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        validateNameExist(() => this.nameProject, 'add', undefined)]],
      description: [''],
      target : ['VMWare vCenter'],
      option: [''],
      enclave_number: [ 1,
        [Validators.min(1),
        Validators.max(100),
        Validators.required,
        ]],
      enclave_clients: [ 3,
        [Validators.min(0),
        Validators.max(100),
        Validators.required,
        ]],
      enclave_servers: [ 2,
        [Validators.min(0),
        Validators.max(100),
        Validators.required,
        ]],
      enclave_users: [ 5,
        [Validators.min(0),
        Validators.max(100),
        Validators.required,
        ]],
      vlan_min: [ 2000,
        [Validators.min(1),
        Validators.max(4093),
        Validators.required
        ]],
      vlan_max: [ 2100,
        [Validators.min(2),
        Validators.max(4094),
        Validators.required,
        ]]
    })
    this.projectService.getProjectByStatus('active').subscribe(data => {
      this.store.dispatch(retrievedProjects({data: data.result}));
    })
    this.appPrefService.get("2").subscribe((data: any) => this.store.dispatch(retrievedAppPref({ data: data.result })));
  }

  get name() {
    return this.projectForm.get('name');
  }

  get description() { return this.projectForm.get('description');}
  get target() { return this.projectForm.get('target');}
  get option() { return this.projectForm.get('option');}

  get enclave_number() {
    return this.projectForm.get('enclave_number');
  }

  get enclave_clients() {
    return this.projectForm.get('enclave_clients');
  }
  get enclave_servers() {
    return this.projectForm.get('enclave_servers');
  }
  get enclave_users() {
    return this.projectForm.get('enclave_users');
  }
  get vlan_min() {
    return this.projectForm.get('vlan_min');
  }
  get vlan_max() {
    return this.projectForm.get('vlan_max');
  }

  addProject() {
    let items: any[] = [];
    this.gridApi.forEachNode(node => items.push(node.data));
    Object.values(items).forEach(val => {
      if (!Array.isArray(val.reserved_ip)) {
        val.reserved_ip = this.helpers.processIpForm(val.reserved_ip)
      }
      this.isDisableButton = true ? ((val.network === '') || (val.category === '')) : false
    })
    if (this.projectForm.valid && !this.isDisableButton) {
      const jsonData = {
        name: this.name?.value,
        description: this.description?.value,
        target: this.target?.value,
        option: this.option?.value,
        enclave_number: this.enclave_number?.value,
        enclave_clients: this.enclave_clients?.value,
        enclave_servers: this.enclave_servers?.value,
        enclave_users: this.enclave_users?.value,
        vlan_min: this.vlan_min?.value,
        vlan_max: this.vlan_max?.value,
        networks: items
      }
      this.projectService.add(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
        ).subscribe(rest =>{
          this.toastr.success(`Created Project ${rest.result.name} successfully`);
          this.router.navigate([RouteSegments.PROJECTS]);
      });
    } else {
      this.toastr.warning('Category and network fields are required.')
    }
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  cancelProject() {
    this.router.navigate([RouteSegments.PROJECTS]);
  }

  numericOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  onDelete(params: any) {
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?',
      submitButtonName: 'OK'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData, autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rowData.splice(params.rowData.index, 1);
        this.gridApi.applyTransaction({ remove: [params.rowData] });
        this.toastr.success("Deleted Networks successfully")
      }
    });
    return this.rowData;
  }

  addNetwork() {
    const jsonData = {
      category: '',
      network: '',
      reserved_ip: []
    }
    this.gridApi.applyTransaction({ add: [jsonData] });
  }

  setterValueNetwork(params: ValueSetterParams) {
    return this.helpers.setterValue(params)
  }
}
