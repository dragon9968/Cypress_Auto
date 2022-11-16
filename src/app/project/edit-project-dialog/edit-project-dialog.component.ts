import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { retrievedProjects } from 'src/app/store/project/project.actions';
import { retrievedUserTasks } from 'src/app/store/user-task/user-task.actions';
import { selectUserTasks } from 'src/app/store/user-task/user-task.selectors';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss']
})
export class EditProjectDialogComponent implements OnInit, OnDestroy {
  editProjectForm!: FormGroup;
  selectUserTasks$ = new Subscription();
  listUser!: any[];
  listShared: any[] = [];
  isLoading = false;
  constructor(
    public helpers: HelpersService,
    private projectService: ProjectService,
    private store: Store,
    private userService: UserService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.selectUserTasks$ = this.store.select(selectUserTasks).subscribe(data => {
      this.listUser = data;
    })

    this.editProjectForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50)]),
      descriptionCtr: new FormControl(''),
      minVlanCtr: new FormControl('', [Validators.min(1), Validators.max(4093),Validators.required]),
      maxVlanCtr: new FormControl('', [Validators.min(1), Validators.max(4094),Validators.required]),
      sharedCtr: new FormControl(''),
    })

  }

  get nameCtr() { return this.editProjectForm.get('nameCtr');}
  get descriptionCtr() { return this.editProjectForm.get('descriptionCtr');}
  get minVlanCtr() { return this.editProjectForm.get('minVlanCtr');}
  get maxVlanCtr() {  return this.editProjectForm.get('maxVlanCtr');}
  get sharedCtr() { return this.helpers.getAutoCompleteCtr(this.editProjectForm.get('sharedCtr'), this.listUser); }

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
    this.descriptionCtr?.setValue(this.data.genData.description);
    this.minVlanCtr?.setValue(this.data.genData.vlan_min);
    this.maxVlanCtr?.setValue(this.data.genData.vlan_max);
    this.data.genData.share.forEach((el: any) => {
      this.listShared.push(el)
      this.listUser = this.listUser.filter(value => value.username != el.username)
    });
    this.userService.getAll().subscribe(data => {
      this.store.dispatch(retrievedUserTasks({data: data.result}));
    })
  }

  ngOnDestroy(): void {
    this.selectUserTasks$.unsubscribe();
  }


  numericOnly(event: any): boolean { 
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 101 || charCode == 69 || charCode == 45 || charCode == 43) {
      return false;
    }
    return true;
  }

  cancelProject() {
    this.dialogRef.close();
  }

  updateProject() {
    const sharedUpdate = this.listShared.map(el => el.username)
    if(this.editProjectForm.valid) {
      const jsonData = {
        name: this.nameCtr?.value,
        description: this.descriptionCtr?.value,
        vlan_min: this.minVlanCtr?.value,
        vlan_max: this.maxVlanCtr?.value,
      }
      this.projectService.put(this.data.genData.id, jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
        ).subscribe((_respData: any) => {
          this.projectService.get(this.data.genData.id).subscribe(projectData => {
              const configData = {
                pk: this.data.genData.id,
                username: sharedUpdate
              }
              this.projectService.associate(configData).subscribe(respData => {
                this.toastr.success(`Update Project successfully`)
                this.projectService.getProjectByStatus('active').subscribe((data: any) => this.store.dispatch(retrievedProjects({ data: data.result })));
              });
            this.dialogRef.close();
          });
        });
    }
  }

  remove(option: any): void {
    const index = this.listShared.indexOf(option);
    if (index >= 0) {
      this.listShared.splice(index, 1);
        this.listUser.unshift(option)
    }
  }

  selectShared(event: MatAutocompleteSelectedEvent) {
    this.listShared.push(event.option.value)
    Object.values(this.listShared).forEach(val => {
      this.listUser = this.listUser.filter(value => value.id != val.id)
    });
  }

}
