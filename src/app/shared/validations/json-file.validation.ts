import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateJsonFile(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filename = control.value;
    if (!filename || filename.length == 0 || filename.endsWith('.json')) {
     return null;
    } else {
      return { isNotJsonFile: true }
    }
  }
}
