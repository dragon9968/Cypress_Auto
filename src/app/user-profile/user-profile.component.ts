import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../core/services/auth/auth.service';
import { HelpersService } from '../core/services/helpers/helpers.service';
import { UserService } from '../core/services/user/user.service';
import { ErrorMessages } from '../shared/enums/error-messages.enum';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userProfileForm: FormGroup;
  isViewMode = false;
  errorMessages = ErrorMessages;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private helpersService: HelpersService,
    ) {
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
    const accessToken = this.authService.getAccessToken();
    const accessTokenPayload = this.helpersService.decodeToken(accessToken);
    const userId = accessTokenPayload.identity;
    this.userService.get(userId).subscribe(respData => {
      this.usernameCtr?.setValue(respData.result.username);
      this.firstNameCtr?.setValue(respData.result.first_name);
      this.lastNameCtr?.setValue(respData.result.last_name);
      this.emailCtr?.setValue(respData.result.email);
      this.roleCtr?.setValue(respData.result.roles[0].name);
      this.activeCtr?.setValue(respData.result.active);
    });
  }
}
