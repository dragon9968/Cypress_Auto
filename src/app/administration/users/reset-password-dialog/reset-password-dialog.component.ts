import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { checkPasswords } from 'src/app/shared/validations/confirm-password.validation';
import { retrievedUsers } from 'src/app/store/user/user.actions';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: AbstractControl<any, any> | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!control?.dirty && form?.errors?.['isNotMatch']
  }
}

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {
  errorMessages = ErrorMessages;
  resetPasswordForm!: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  public showPassword: boolean = false;
  public showConfirmPassword: boolean = false;
  constructor(
    public helpers: HelpersService,
    private store: Store,
    private toastr: ToastrService,
    private userService: UserService,
    public dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helpersService: HelpersService
  ) {
    this.resetPasswordForm = new FormGroup({
      passwordCtr: new FormControl({value: '', disabled: false}, [Validators.required]),
      confirmPasswordCtr: new FormControl({value: '', disabled: false})
    }, { validators: checkPasswords("reset") })
  }

  get passwordCtr() { return this.resetPasswordForm.get('passwordCtr') }
  get confirmPasswordCtr() { return this.resetPasswordForm.get("confirmPasswordCtr") }

  ngOnInit(): void {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onCancel() {
    this.dialogRef.close()
  }

  resetPassword() {
    const jsonDataValue = {
      update_password: this.passwordCtr?.value,
    }
    const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.userService.put(this.data.genData.id, jsonData).pipe(
      catchError((e: any) => {
        this.toastr.error(e.error.message);
        return throwError(() => e);
      })
    ).subscribe(() => {
      this.dialogRef.close();
      this.toastr.success(`Password Changed`)
      this.userService.getAll().subscribe((data: any) => this.store.dispatch(retrievedUsers({ users: data.result})));
    });
  }

}
