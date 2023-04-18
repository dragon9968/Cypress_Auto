import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, Observable, Subscription, throwError } from "rxjs";
import { Store } from '@ngrx/store';
import { ToastrService } from "ngx-toastr";
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/project/services/project.service';
import { selectProjectTemplate } from 'src/app/store/project/project.selectors';
import { retrievedProjects, retrievedProjectsTemplate } from 'src/app/store/project/project.actions';
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
import { MatRadioChange } from '@angular/material/radio';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { NgxPermissionsService } from "ngx-permissions";

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
  selectProjectTemplate$ = new Subscription();
  nameProject!: any[];
  projectTemplate!: any[];
  rowData!: any[];
  checked = false;
  status = 'active';
  dataClone: any;
  isDisableButton = false;
  isHiddenNetwork = false;
  isHiddenTemplate = false;
  isHiddenOption = true;
  appPrefDefault!: any[];
  isDisableTemplate = true;
  isCreateNewFromSelected = false;
  filteredTemplate!: Observable<any[]>;

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
    public helpers: HelpersService,
    private ngxPermissionsService: NgxPermissionsService,
  ) {

    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state?.['option'] == 'clone') {
      this.isCreateNewFromSelected = true;
      this.dataClone = state;
    }

    this.projectForm = this.formBuilder.group({
      name : ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), validateNameExist(() => this.nameProject, 'add', undefined)]],
      description: [''],
      category: ['project'],
      target : ['VMWare vCenter'],
      option: [''],
      layoutOnly: [false],
      template: [''],
      enclave_number: [1, [Validators.min(1), Validators.max(100), Validators.required]],
      enclave_clients: [3, [Validators.min(0), Validators.max(100), Validators.required]],
      enclave_servers: [2, [Validators.min(0), Validators.max(100), Validators.required]],
      enclave_users: [5, [Validators.min(0), Validators.max(100), Validators.required]],
      vlan_min: [2000, [Validators.min(1), Validators.max(4093), Validators.required]],
      vlan_max: [2100, [Validators.min(2), Validators.max(4094), Validators.required]]
    })
    this.projectService.getAll().subscribe((data: any) => {
      this.nameProject = data.result;
    });

    this.selectProjectTemplate$ = this.store.select(selectProjectTemplate).subscribe(templateData => {
      this.projectTemplate = templateData;
      if (this.projectTemplate) {
        this.template.setValidators([autoCompleteValidator(this.projectTemplate)]);
        this.filteredTemplate = this.helpers.filterOptions(this.template, this.projectTemplate);
      }
    })
    this.selectAppPref$ = this.store.select(selectAppPref).subscribe((data: any)=> {
      if (data) {
        let pubNetwork = {
          "network": data.public_network ? data.public_network : "10.0.0.0/8",
          "category": "public",
          "reserved_ip": data.public_reserved_ip
        }
        let privNetwork = {
          "network": data.private_network ? data.private_network : "192.168.0.0/16",
          "category": "private",
          "reserved_ip": data.private_reserved_ip
        }
        let manNetwork = {
          "network": data.management_network ? data.management_network : "172.16.0.0/22",
          "category": "management",
          "reserved_ip": data.management_reserved_ip
        }
        this.rowData = [pubNetwork, privNetwork, manNetwork]
      }
    })
  }

  ngOnInit(): void {
    let permissions = this.ngxPermissionsService.getPermissions();
    let isCanWriteProject = false
    let isCanReadSettings = false

    for (let p in permissions) {
      if (p === "can_write on Project") {
        isCanWriteProject = true
      }
      if (p === "can_read on Settings") {
        isCanReadSettings = true
      }
    }
    if (!isCanWriteProject || !isCanReadSettings) {
      console.log('You are not authorized to view this page !')
      this.toastr.warning('Not authorized!', 'Warning');
      this.router.navigate([RouteSegments.ROOT]);
    }
    this.helpers.setAutoCompleteValue(this.template, this.projectTemplate, '');
    this.projectService.getProjectByStatusAndCategory(this.status, 'project').subscribe(data => {
      this.store.dispatch(retrievedProjects({data: data.result}));
    })
    this.appPrefService.get("2").subscribe((data: any) => this.store.dispatch(retrievedAppPref({ data: data.result })));
    this.projectService.getProjectByStatusAndCategory(this.status, 'template').subscribe((data: any) => this.store.dispatch(retrievedProjectsTemplate({ template: data.result })));
  }

  get name() { return this.projectForm.get('name'); }
  get description() { return this.projectForm.get('description'); }
  get category() { return this.projectForm.get('category'); }
  get target() { return this.projectForm.get('target'); }
  get option() { return this.projectForm.get('option'); }
  get layoutOnly() { return this.projectForm.get('layoutOnly'); }
  get template() { return this.helpers.getAutoCompleteCtr(this.projectForm.get('template'), this.projectTemplate);  }
  get enclave_number() { return this.projectForm.get('enclave_number'); }
  get enclave_clients() { return this.projectForm.get('enclave_clients'); }
  get enclave_servers() { return this.projectForm.get('enclave_servers'); }
  get enclave_users() { return this.projectForm.get('enclave_users'); }
  get vlan_min() { return this.projectForm.get('vlan_min'); }
  get vlan_max() { return this.projectForm.get('vlan_max'); }

  selectLayout(event: any) {
    if (event.checked) {
      this.isHiddenNetwork = false
    } else {
      this.isHiddenNetwork = true
    }
  }

  onOptionChange(event: MatRadioChange) {
    if (event.value === 'blank') {
      this.isHiddenTemplate = false
      this.isHiddenOption = true
      this.isHiddenNetwork = false
      this.checked = false
      this.isDisableTemplate = true
    } else if (event.value === 'template') {
      this.isHiddenTemplate = true
      this.isHiddenOption = true
      if (!this.checked) {
        this.isHiddenNetwork = true
      }
      this.isDisableTemplate = false
      this.checked = false
    } else {
      this.isHiddenOption = false
      this.checked = false
      this.isHiddenTemplate = false
      this.isHiddenNetwork = false
      this.isDisableTemplate = true
    }
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
      const jsonDataValue = {
        name: this.name?.value,
        description: this.description?.value,
        category: this.category?.value,
        target: this.target?.value,
        option: this.option?.value,
        layout_only: this.layoutOnly?.value,
        template_id: this.template?.value.id,
        enclave_number: this.enclave_number?.value,
        enclave_clients: this.enclave_clients?.value,
        enclave_servers: this.enclave_servers?.value,
        enclave_users: this.enclave_users?.value,
        vlan_min: this.vlan_min?.value,
        vlan_max: this.vlan_max?.value,
        networks: items
      }
      let jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
      if (!jsonData.template_id && !this.isDisableTemplate) {
        this.toastr.warning('The template field is required.')
      } else {
        if (this.isCreateNewFromSelected) {
          jsonData = {...jsonData, ...this.dataClone}
        }
        this.projectService.add(jsonData).pipe(
          catchError((e: any) => {
            this.toastr.error(e.error.message);
            return throwError(() => e);
          })
          ).subscribe(rest => {
            if (this.isCreateNewFromSelected) {
              this.projectService.validateProject({pk: rest.result.id}).pipe(
                catchError((e: any) => {
                  return throwError(() => e)
                })
              ).subscribe(() => {});
              this.isCreateNewFromSelected = false;
            }
            this.toastr.success(`Created ${rest.result.category} ${rest.result.name} successfully`);
            if (this.category?.value === 'project') {
              this.router.navigate([RouteSegments.PROJECTS]);
            } else {
              this.router.navigate([RouteSegments.PROJECTS_TEMPLATES]);
            }
        });
      }
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData, autoFocus: false });
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
