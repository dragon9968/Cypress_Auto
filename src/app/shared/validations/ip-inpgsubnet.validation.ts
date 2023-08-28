import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { matches } from 'ip-matching';
import { isIPv4 } from "is-ip";
import { ErrorMessages } from "../enums/error-messages.enum";

export function ipInPortGroupSubnet(mode: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let interfacesIp: any;
    let subnetPG: any;
    let ipAllocation: any;
    if (mode === 'connect') {
      interfacesIp = control.get('interfaceCtr')?.value.ip;
      subnetPG = control.get('targetPortGroupCtr')?.value.subnet;
    } else {
      interfacesIp = control.get('ipCtr')?.value;
      subnetPG = control.get('portGroupCtr')?.value.subnet;
      ipAllocation =  control.get('ipAllocationCtr')?.value;
    }
    if (interfacesIp && subnetPG && !['static_auto', 'dhcp'].includes(ipAllocation)) {
      if (isIPv4(interfacesIp)) {
        const checkIpInSubnet = matches(interfacesIp, subnetPG)
        if (!checkIpInSubnet) {
          let message = ErrorMessages.IP_IN_PGSUBNET;
          return { isNotMatch: true, message };
        }
      } else {
        const isNotIp = !isIPv4(interfacesIp)
        if (isNotIp) {
          let message = ErrorMessages.FIELD_IS_IP;
          return { isNotMatchIP: true, message }
        }
      }
    }
    return null;
  }
}