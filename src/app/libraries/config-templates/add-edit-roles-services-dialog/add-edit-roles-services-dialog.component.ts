import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';

@Component({
  selector: 'app-add-edit-roles-services-dialog',
  templateUrl: './add-edit-roles-services-dialog.component.html',
  styleUrls: ['./add-edit-roles-services-dialog.component.scss']
})
export class AddEditRolesServicesDialogComponent implements OnInit {
  roleServicesForm!: FormGroup;
  rolesList: any[] = [];
  roleService: any[] = [];
  roleServiceKey: any[] = [];
  filteredRoles!: Observable<any[]>;

  constructor(
    public helpers: HelpersService,
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditRolesServicesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.roleServicesForm = new FormGroup({
      roles: new FormControl('')
    })
    this.configTemplateService.getWinRoles().subscribe(data => {
      this.rolesList = data;
      this.roles.setValidators([autoCompleteValidator(this.rolesList)]);
      this.filteredRoles = this.helpers.filterOptions(this.roles, this.rolesList);
    });
  }
  get roles() {
    return this.helpers.getAutoCompleteCtr(this.roleServicesForm.get('roles'), this.rolesList);
  }

  ngOnInit(): void {}

  onCancel() {
    this.dialogRef.close();
  }

  addRoleServices() {
    this.roleServiceKey = this.roleService.map(ele => ele.role);
    const jsonData = {
      config_type: "role_services",
      config_id: this.data.genData.id,
      role_services: this.roleServiceKey
    }
    this.configTemplateService.addConfiguration(jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Add Roles & Service successfully`);
        this.dialogRef.close();
        this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({ data: data.result })));
      },
      error: (err) => {
        this.toastr.error(`Error while add Roles & Service`);
      }
    });
  }

  remove(roles: any): void {
    const index = this.roleService.indexOf(roles);
    if (index >= 0) {
      this.roleService.splice(index, 1);
      this.rolesList.unshift(roles)
    }
  }


  selectRolesOrServices(event: MatAutocompleteSelectedEvent) {
    this.roleService.push(event.option.value)
    Object.values(this.roleService).forEach(val => {
      this.rolesList = this.rolesList.filter(value => value.role != val.role)
    });
  }

}
