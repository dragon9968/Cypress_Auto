import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { checkPasswords } from 'src/app/shared/validations/confirm-password.validation';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedUser } from 'src/app/store/user/user.actions';
import { selectRole, selectUser } from 'src/app/store/user/user.selectors';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control?.dirty && form?.errors?.['isNotMatch']
  }
}

@Component({
  selector: 'app-add-edit-user-dialog',
  templateUrl: './add-edit-user-dialog.component.html',
  styleUrls: ['./add-edit-user-dialog.component.scss']
})
export class AddEditUserDialogComponent implements OnInit, OnDestroy {
  @ViewChild('chipList') chipList!: MatChipList;
  errorMessages = ErrorMessages;
  errorMatcher = new CrossFieldErrorMatcher();
  usersForm!: FormGroup;
  selectRole$ = new Subscription();
  selectUser$ = new Subscription();
  isViewMode = false;
  addOnBlur = true;
  listRole!: any[];
  listUser!: any[];
  roles: any[] = [];
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public helpers: HelpersService,
    private store: Store,
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<AddEditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.selectRole$ = this.store.select(selectRole).subscribe(data => {
      this.listRole = data;
    });

    this.selectUser$ = this.store.select(selectUser).subscribe((data: any) => {
      this.listUser = data
    })

    this.isViewMode = this.data.mode === 'view'
    this.usersForm = new FormGroup({
      firstNameCtr: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      lastNameCtr: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      userNameCtr: new FormControl({value: '', disabled: this.isViewMode},
      [Validators.required, validateNameExist(() => this.listUser, this.data.mode, this.data.genData.id, "username")]),
      activeCtr: new FormControl({value: '', disabled: this.isViewMode}),
      emailCtr: new FormControl({value: '', disabled: this.isViewMode},
      [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required, validateNameExist(() => this.listUser, this.data.mode, this.data.genData.id, "email")]),
      roleCtr: new FormControl({value: '', disabled: this.isViewMode}),
      passwordCtr: new FormControl({value: '', disabled: this.isViewMode}, [Validators.required]),
      confirmPasswordCtr: new FormControl({value: '', disabled: this.isViewMode}),
      loginCountCtr: new FormControl({value: '', disabled: this.isViewMode})
    }, { validators: checkPasswords(this.data.mode) })
   }

  ngOnDestroy(): void {
    this.selectRole$.unsubscribe();
    this.selectUser$.unsubscribe();
  }

  get firstNameCtr() { return this.usersForm.get('firstNameCtr')}
  get lastNameCtr() { return this.usersForm.get('lastNameCtr')}
  get userNameCtr() { return this.usersForm.get('userNameCtr')}
  get activeCtr() { return this.usersForm.get('activeCtr')}
  get emailCtr() { return this.usersForm.get('emailCtr')}
  get roleCtr() { return this.usersForm.get('roleCtr')}
  get passwordCtr() { return this.usersForm.get('passwordCtr')}
  get confirmPasswordCtr() { return this.usersForm.get("confirmPasswordCtr")}
  get loginCountCtr() { return this.usersForm.get("loginCountCtr")}

  ngOnInit(): void {
    this.firstNameCtr?.setValue(this.data.genData.first_name);
    this.lastNameCtr?.setValue(this.data.genData.last_name);
    this.userNameCtr?.setValue(this.data.genData.username);
    this.activeCtr?.setValue(this.data.genData.active);
    this.emailCtr?.setValue(this.data.genData.email);
    this.passwordCtr?.setValue(this.data.genData.password);
    this.loginCountCtr?.setValue(this.data.genData.login_count);
    if (this.data.mode === 'update' || this.data.mode === 'view') {
      this.data.genData.roles.forEach((el: any) => {
      this.roles.push(el);
      this.listRole = this.listRole.filter(value => value.id != el.id)
      });
    }
    if (this.roles.length === 0) {
      this.roleCtr?.setErrors({
        required: this.errorMessages.FIELD_IS_REQUIRED
      });
    }
    if (this.data.mode === 'add') {
      this.roleCtr?.setValidators([Validators.required]);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onCancel() {
    this.dialogRef.close();
  }

  remove(role: any): void {
    const index = this.roles.indexOf(role);
    if (index >= 0) {
      this.roles.splice(index, 1);
      if ((this.data.mode === 'add') || (this.data.mode === 'update')) {
        this.listRole.unshift(role)
      }
    }
    if (this.roles.length === 0) {
      this.roleCtr?.setErrors({
        required: this.errorMessages.FIELD_IS_REQUIRED
      });
    }
  }

  addRole(event: MatChipInputEvent) {
    const value = event.value;
    const input = event.input;
    if (value.trim()) {
      const matchValue = this.listRole.filter(val => val.name.toLowerCase() === value.toLowerCase());
      const matchNotSelected =
        this.roles === null
        ? matchValue
        : matchValue.filter(val => !this.roles.find(el => el.id === val.id))
      if (matchNotSelected.length === 1) {
        this.roles.push(matchNotSelected[0])
        this.listRole = this.listRole.filter(value => value.id != matchNotSelected[0].id)
      }
    }
    if (input) {
      input.value = ''
    }
  }

  selectRole(event: MatAutocompleteSelectedEvent) {
    this.roles.push(event.option.value)
    Object.values(this.roles).forEach(val => {
      this.listRole = this.listRole.filter(value => value.id != val.id)
    });
  }

  addUser() {
    const role = this.roles.map(val => val.name)
    const jsonDataValue = {
      first_name: this.firstNameCtr?.value,
      last_name: this.lastNameCtr?.value,
      username: this.userNameCtr?.value,
      active: this.activeCtr?.value,
      email: this.emailCtr?.value,
      password: this.passwordCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.userService.add(jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(respData=> {
      const roleData = {
        pk: respData.id,
        roles: role,
      }
      this.userService.associate(roleData).subscribe(() => {
        this.toastr.success(`Add User successfully`)
        this.userService.getAll().subscribe((data: any) => this.store.dispatch(retrievedUser({data: data.result})));
      });
      this.dialogRef.close();
    });
  }

  updateUser() {
    const role = this.roles.map(val => val.name)
    const jsonDataValue = {
      first_name: this.firstNameCtr?.value,
      last_name: this.lastNameCtr?.value,
      username: this.userNameCtr?.value,
      active: this.activeCtr?.value,
      email: this.emailCtr?.value,
      password: this.passwordCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.userService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(()=> {
      const roleData = {
        pk: this.data.genData.id,
        roles: role,
      }
      this.userService.associate(roleData).subscribe(() => {
        this.toastr.success(`Updated User successfully`)
        this.userService.getAll().subscribe((data: any) => this.store.dispatch(retrievedUser({data: data.result})));
      });
      this.dialogRef.close();
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.firstNameCtr?.enable();
    this.lastNameCtr?.enable();
    this.userNameCtr?.enable();
    this.activeCtr?.enable();
    this.emailCtr?.enable();
    this.roleCtr?.enable();
  }
}
