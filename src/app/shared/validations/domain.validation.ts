import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateDomainName(getDomains: () => any[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nameValue = control.value;
    if (nameValue == undefined || typeof nameValue !== 'string' || nameValue == '') {
      return null;
    }
    const domains: any[] = getDomains();
    const isExistDomainName = domains.some((domain: any) => domain.name === nameValue);
    return isExistDomainName ? { isExist: true } : null;
  }
}
