import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ipInNetworkValidator(publicNetwork: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (publicNetwork) {
      const privateIps = control.value;
      let ips = publicNetwork.split('.');
      let ipNetwork = ips[0]
      let privateIp = privateIps.split(',');
      let isIpInNetwork = privateIp !== ipNetwork
      if (privateIp) {
        for (let i in privateIp) {
          isIpInNetwork = privateIp[i].split('.')[0] !== ipNetwork
        }
      }
      if (privateIp == undefined || privateIp == '') return null;
      return isIpInNetwork ? {isNotMatch: true} : null;
    }
    return null;
  }
}