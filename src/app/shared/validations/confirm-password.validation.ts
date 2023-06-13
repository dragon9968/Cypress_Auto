import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export function checkPasswords(mode: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (mode === 'update' || mode === 'view') return null;
    const pass = control.get('passwordCtr')?.value
    const confirmPass = control.get('confirmPasswordCtr')?.value
    return pass === confirmPass ? null : { isNotMatch: true }
  }
}