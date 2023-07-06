import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, catchError, throwError } from 'rxjs';
import { ErrorMessages } from '../shared/enums/error-messages.enum';
import { selectUserProfile } from '../store/user-profile/user-profile.selectors';
import { RolesService } from '../core/services/roles/roles.service';
import { ToastrService } from 'ngx-toastr';
import { retrievedUserProfile } from '../store/user-profile/user-profile.actions';
import { UserService } from '../core/services/user/user.service';
import { AuthService } from '../core/services/auth/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfileForm: FormGroup;
  errorMessages = ErrorMessages;
  selectUser$ = new Subscription();
  userId: any;

  constructor(
    private store: Store,
    private rolesService: RolesService,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.userProfileForm = new FormGroup({
      usernameCtr: new FormControl(''),
      firstNameCtr: new FormControl(''),
      lastNameCtr: new FormControl(''),
      emailCtr: new FormControl('', [Validators.email]),
      roleCtr: new FormControl({ value: '', disabled: true }),
    });
    this.selectUser$ = this.store.select(selectUserProfile).subscribe((user: any) => {
      if (user) {
        this.usernameCtr?.setValue(user.username);
        this.firstNameCtr?.setValue(user.first_name);
        this.lastNameCtr?.setValue(user.last_name);
        this.emailCtr?.setValue(user.email);
        const roles = this.rolesService.getUserRoles();
        if (roles) {
          this.roleCtr?.setValue(roles[0].name);
        }
      }
    });
  }

  get usernameCtr() { return this.userProfileForm.get('usernameCtr'); }
  get firstNameCtr() { return this.userProfileForm.get('firstNameCtr'); }
  get lastNameCtr() { return this.userProfileForm.get('lastNameCtr'); }
  get emailCtr() { return this.userProfileForm.get('emailCtr'); }
  get roleCtr() { return this.userProfileForm.get('roleCtr'); }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
  }

  ngOnDestroy(): void {
    this.selectUser$.unsubscribe();
  }

  updateUserProfile() {
    const data = {
      username: this.usernameCtr?.value,
      first_name: this.firstNameCtr?.value,
      last_name: this.lastNameCtr?.value,
      email: this.emailCtr?.value,
    }
    this.userService.put(this.userId, data).pipe(
      catchError(err => {
        this.toastr.error(err.error.message);
        return throwError(() => err)
      })
    ).subscribe((respData: any) => {
      this.toastr.success('User profile updated!');
      this.store.dispatch(retrievedUserProfile({ data: respData.result }));
    });
  }
}
