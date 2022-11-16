import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Store } from '@ngrx/store';
import { ToastrService } from "ngx-toastr";
import { RouteSegments } from 'src/app/core/enums/route-segments.enum';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from 'src/app/project/services/project.service';
import { selectProjects } from 'src/app/store/project/project.selectors';
import { retrievedProjects } from 'src/app/store/project/project.actions';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  isSubmitBtnDisabled = false;
  labelPosition = 'blank';
  projectForm!: FormGroup;
  routeSegments = RouteSegments;
  selectProjects$ = new Subscription();
  nameProject!: any[];
  isLoading = false;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private router: Router
  ) { 
    this.selectProjects$ = this.store.select(selectProjects).subscribe(nameProject => {
      this.nameProject = nameProject;
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
        [Validators.min(1),
        Validators.max(4094),
        Validators.required,
        ]]
    })
    this.projectService.getProjectByStatus('active').subscribe(data => {
      this.store.dispatch(retrievedProjects({data: data.result}));
    })
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
    if (this.projectForm.valid) {
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

      }
      this.isLoading = true;
      this.projectService.add(jsonData).subscribe({
        next:(rest) => {
          this.toastr.success(`Created Project ${rest.result.name} successfully`);
          this.router.navigate([RouteSegments.PROJECTS]);
          this.isLoading = false;
        },
        error:(err) => {
          this.toastr.error(`Error while add project`);
          this.isLoading = false;
        }
      });
    }
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
}
