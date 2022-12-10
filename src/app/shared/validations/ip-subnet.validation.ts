import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import {isIP, isIPv4} from 'is-ip';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';

export function ipSubnetValidation(subnet: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ips = control.value;
    let message = "Expected 4 octets and only decimal digits permitted. Invalid IP Address";
    const isSubnet = require("is-subnet");
    const matchSubnet = isSubnet(ips)
    const isIpV4 = isIPv4(ips)
    let isMatch = !isIpV4
    if (subnet) {
      if (ips.includes('/')) {
        const ip = ips.split('/')[0]
        if (!isIPv4(ip)) {
          message = message;
        }
        else {
          const subnet = ips.split('/')[1]
          message = `'${subnet}' is not a valid netmask`
        }
      }
      isMatch = (!matchSubnet && !isIpV4)
    } else {
      if (ips == undefined || ips == '') return null;
      let ipArr = ips.split(',');
      isMatch = !isIPv4(ips)
      if (ipArr) {
        for (let ip in ipArr) {
          isMatch = !isIPv4(ipArr[ip])
        }
      }
      message = message;
    }
    return isMatch ? {isNotMatchIP: true, value: message} : null;
  }
}