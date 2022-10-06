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
  projectForm: FormGroup;
  routeSegments = RouteSegments;
  selectProjects$ = new Subscription();
  nameProject!: any[];

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
    this.projectForm = this.formBuilder.group({
      name : ['', 
        [Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(10), 
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
  }

  ngOnInit(): void {
    this.projectService.getProjectByStatus('active').subscribe(data => {
      this.store.dispatch(retrievedProjects({data: data.result}));
    })
  }

  get name() {
    return this.projectForm.get('name');
  }
  get enclave_number() {
    return this.projectForm.get('enclave_number');
  }

  get enclave_clients() {
    return this.projectForm.get('enclave_clients');
  }
  get enclave_servers() {
    return this.projectForm.get('enclave_clients');
  }
  get enclave_users() {
    return this.projectForm.get('enclave_clients');
  }
  get vlan_min() {
    return this.projectForm.get('enclave_clients');
  }
  get vlan_max() {
    return this.projectForm.get('enclave_clients');
  }

  addProject() {
    if (this.projectForm.valid) {
      this.projectService.addProject(this.projectForm.value).subscribe({
        next:(rest) => {
          this.toastr.success(`Created Project ${rest.result.name} successfully`);
          setTimeout(() => {
            this.router.navigate([RouteSegments.PROJECTS]);
          }, 1000);
        },
        error:(err) => {
          this.toastr.error(`Error while add project ${err.result.name}`);
        }
      });
    }
  }

  cancelProject() {
    this.router.navigate([RouteSegments.PROJECTS]);
  }
}
