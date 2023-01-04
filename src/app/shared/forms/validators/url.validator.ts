import { AbstractControl, ValidationErrors } from '@angular/forms';

export function urlValidator(
  control: AbstractControl
): ValidationErrors | null {
  const valid = new RegExp(
    '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
  ).test(control.value);

  return !valid ? { url: true } : null;
}
