import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import {isIPv4} from 'is-ip';
import { ErrorMessages } from "../enums/error-messages.enum";

export function networksValidation(type: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const ips = control.value;
    if (ips) {
      let message = "";
      const isSubnet = require("is-subnet");
      const isIpV4 = isIPv4(ips)
      let isMatchIP = !isIpV4
      let matchSubnet = false;
      let isMatch = false;
      if (ips == '') return null;
      if (type === 'multi') {
        let ipArr = ips.split(',');
        if (ipArr) {
          for (let ip in ipArr) {
            isMatchIP = !isIPv4(ipArr[ip])
            matchSubnet = isSubnet(ipArr[ip])
            if (ipArr[ip].includes('/')) {
              const ipNetworks = ipArr[ip].split('/')[0]
              if (!isIPv4(ipNetworks)) {
                message = ErrorMessages.FIELD_IS_IP;
              } else {
                const subnet = ipArr[ip].split('/')[1]
                message = `'${subnet}' is invalid subnet mask`
              }
            }
          }
        }
        isMatch = (isMatchIP && !matchSubnet)
        message = ErrorMessages.FIELD_IS_IP;
      } else {
        isMatch = isMatchIP;
        message = ErrorMessages.FIELD_IS_IP;
      }
      return isMatch ? {isNotMatchIP: true, value: message} : null;
    }
    return null;
  }
}
