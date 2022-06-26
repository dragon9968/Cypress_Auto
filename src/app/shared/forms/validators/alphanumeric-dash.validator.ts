import { FormControl } from '@angular/forms';

function alphanumbericDashValidator(control: FormControl) {
  const regex = new RegExp('^([A-Za-z0-9_]+)$');
  const isValid = regex.test(control.value);
  return isValid ? null : { alphanumberic_dash_error: true };
}

export { alphanumbericDashValidator };
