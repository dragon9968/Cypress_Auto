import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ipValidator(subnet: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const publicNetworkIPs = control.value;
    const octet = '(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]?|0)';
    const regex_subnet = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$|^${octet}\\.${octet}\\.${octet}\\.${octet}\\/${octet}$`);
    const regex = new RegExp(`^${octet}\\.${octet}\\.${octet}\\.${octet}$`);
    let pattern = subnet ? regex_subnet : regex;
    if (publicNetworkIPs == undefined || publicNetworkIPs == '') return null;
    let ips = publicNetworkIPs.split(',');
    let match = publicNetworkIPs.match(pattern);
    if (ips) {
      match = publicNetworkIPs.match(pattern)
      for (let ip in ips) {
        match = ips[ip].match(pattern)
      }
    }
    return match != null ? null : { isNotMatchPattern: true }
  }
}