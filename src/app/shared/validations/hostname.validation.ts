import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const hostnameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const hostnameCtr = control.get('hostnameCtr');
  const deviceCtr = control.get('deviceCtr');
  const deviceName = deviceCtr?.value.name
  const hostname = hostnameCtr?.value
  if (hostname) {
    const minLength = 3;
    let maxLength = 15;
    let message = "Input must be consists of letter, number, hyphen and/or underscore";
    let pattern = "^[A-Za-z0-9._-]*$";
    if (deviceName == "Linux Client" || deviceName == "Linux Server") {
      maxLength = 60;
    } else if (deviceName == "VyOS") {
      maxLength = 20
      message = "Input must be consists of letter, number and/or hyphen";
      pattern = "^[A-Za-z0-9.-]*$";
    } else if (deviceName == "pfSense") {
      maxLength = 20;
    }
    if (minLength > hostname.length || maxLength < hostname.length ) {
      message = "Field must be between " + minLength + " and " + maxLength + " characters.";
      return { isNotMatchLength: true, message };
    }
    if (!hostname.match(pattern)) {
      return { isNotMatchPattern: true, message };
    }
  }
  return null;
};