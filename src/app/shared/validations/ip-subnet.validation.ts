import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { isIPv4 } from 'is-ip';
import { ErrorMessages } from "../enums/error-messages.enum";

export function ipSubnetValidation(subnet: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ips = control.value;
    if (ips) {
      let message;
      const isSubnet = require("is-subnet");
      const matchSubnet = isSubnet(ips)
      const isIpV4 = isIPv4(ips)
      let isMatch = !isIpV4
      if (subnet) {
        if (ips.includes('/')) {
          const ip = ips.split('/')[0]
          if (!isIPv4(ip)) {
            message = ErrorMessages.FIELD_IS_IP;
          }
          else {
            const subnet = ips.split('/')[1]
            message = `'${subnet}' is not a valid netmask`
          }
        }
        isMatch = (!matchSubnet && !isIpV4)
      } else {
        if (ips == '') return null;
        let ipArr = ips.split(',');
        isMatch = !isIPv4(ips)
        if (ipArr) {
          for (let ip in ipArr) {
            isMatch = !isIPv4(ipArr[ip])
          }
        }
        message = ErrorMessages.FIELD_IS_IP;
      }
      return isMatch ? {isNotMatchIP: true, value: message} : null;
    }
    return null;
  }
}
