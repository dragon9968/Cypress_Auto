import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ErrorMessages } from '../shared/enums/error-messages.enum';
import { selectUserProfile } from '../store/user-profile/user-profile.selectors';
import { selectUser } from '../store/user/user.selectors';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  isViewMode = false;
  errorMessages = ErrorMessages;
  selectUser$ = new Subscription();

  constructor(private store: Store) {
    this.userProfileForm = new FormGroup({
      usernameCtr: new FormControl(''),
      firstNameCtr: new FormControl(''),
      lastNameCtr: new FormControl(''),
      emailCtr: new FormControl(''),
      roleCtr: new FormControl(''),
      activeCtr: new FormControl(''),
    });
  }

  get usernameCtr() { return this.userProfileForm.get('usernameCtr'); }
  get firstNameCtr() { return this.userProfileForm.get('firstNameCtr'); }
  get lastNameCtr() { return this.userProfileForm.get('lastNameCtr'); }
  get emailCtr() { return this.userProfileForm.get('emailCtr'); }
  get roleCtr() { return this.userProfileForm.get('roleCtr'); }
  get activeCtr() { return this.userProfileForm.get('activeCtr'); }

  ngOnInit(): void {
    this.selectUser$ = this.store.select(selectUserProfile).subscribe((user: any) => {
      this.usernameCtr?.setValue(user.username);
      this.firstNameCtr?.setValue(user.first_name);
      this.lastNameCtr?.setValue(user.last_name);
      this.emailCtr?.setValue(user.email);
      this.roleCtr?.setValue(user.roles[0].name);
      this.activeCtr?.setValue(user.active);
    });
  }
}
