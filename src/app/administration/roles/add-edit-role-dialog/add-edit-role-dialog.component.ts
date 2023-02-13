import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { DualListComponent } from 'angular-dual-listbox';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedRole } from 'src/app/store/user/user.actions';
import { selectPermissions, selectRole } from 'src/app/store/user/user.selectors';

@Component({
  selector: 'app-add-edit-role-dialog',
  templateUrl: './add-edit-role-dialog.component.html',
  styleUrls: ['./add-edit-role-dialog.component.scss']
})
export class AddEditRoleDialogComponent implements OnInit, OnDestroy {
  rolesForm!: FormGroup;
  errorMessages = ErrorMessages;
  permissions$ = new Subscription();
  selectRole$ = new Subscription();
  listRole!: any[];
  listPermissions!: any[];
  selected: any;
  options: any;
  permission!: any;
  source: any;
  confirmed: any[] = [];
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private rolesService: RolesService,
    public dialogRef: MatDialogRef<AddEditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.selectRole$ = this.store.select(selectRole).subscribe(roleData => {
      this.listRole = roleData;
    })

    this.rolesForm = new FormGroup({
      nameCtr: new FormControl('', [Validators.required, validateNameExist(() => this.listRole, this.data.mode, this.data.genData.id)])
    });

    this.permissions$ = this.store.select(selectPermissions).subscribe(data => {
      this.listPermissions = data;
      this.listPermissions = this.listPermissions.map(val => ({
        id: val.id,
        permission_id: val.permission_id,
        view_menu_id: val.view_menu_id,
        permisionName: val.permission?.name + ' on ' + val.view_menu?.name
        })
      )
    })
    this.confirmed = [];

    if (this.data.mode === 'update') {
      this.data.genData.permissions.forEach((el: any) => {
        const value  = this.listPermissions.filter(item =>
          item.id === el.id
        )
        this.confirmed.push(value[0])
      })
    } else {
      this.confirmed = [];
    }
   }

  get nameCtr() { return this.rolesForm.get('nameCtr')}

  ngOnInit(): void {
    this.nameCtr?.setValue(this.data.genData.name);
  }

     
  ngOnDestroy(): void {
    this.selectRole$.unsubscribe();
    this.permissions$.unsubscribe();
  }


  addRole() {
    const [permissionItems, remove] = this.processPermisions();
    if (this.rolesForm.valid) {
      const jsonDataValue = {
        name: this.nameCtr?.value
      }
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.rolesService.add(jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe((_respData: any) => {
        const respData = {
          pk: _respData.id,
          permissions: permissionItems
        }
        this.rolesService.associate(respData).subscribe(respData => {
         this.toastr.success("Add user roles successfully");
         this.rolesService.getAll().subscribe(data => this.store.dispatch(retrievedRole({ role: data.result })));
        });
        this.dialogRef.close();
      });
    }
  }

  updateRole() {
    const [permissionItems, remove] = this.processPermisions();
    if (this.rolesForm.valid) {
      const jsonDataValue = {
        name: this.nameCtr?.value
      }
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.rolesService.put(this.data.genData.id, jsonData).pipe(
        catchError((e: any) => {
          this.toastr.error(e.error.message);
          return throwError(() => e);
        })
      ).subscribe((_respData: any) => {
        const respData = {
          pk: this.data.genData.id,
          permissions: permissionItems
        }
        this.rolesService.associate(respData).subscribe(respData => {
         this.toastr.success("Update user roles successfully");
         this.rolesService.getAll().subscribe(data => this.store.dispatch(retrievedRole({ role: data.result })));
        });
        this.dialogRef.close();
      });
    }
  }

  processPermisions() {
    let permissionItems = this.listPermissions.filter((item) => {
      if (
        this.confirmed.findIndex((f: any) => f.id == item.id) != -1
      ) {
        return true;
      }
      return false;
    });
    let remove = this.listPermissions.filter((item) => {
      if (
        this.confirmed.findIndex((f: any) => f.id == item.id) == -1
      ) {
        return true;
      }
      return false;
    });
    return [permissionItems, remove]
  }

  onCancel() {
    this.dialogRef.close();
  }

}
