import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ipInNetworkValidator(publicNetwork: string, category: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (publicNetwork) {
      const privateIps = control.value;
      let ips = publicNetwork.split('.');
      let ipNetwork = ips[0]
      let privateIp = privateIps.split(',');
      let isIpInNetwork = privateIp !== ipNetwork
      if (privateIp && category === 'public') {
        for (let i in privateIp) {
          isIpInNetwork = privateIp[i].split('.')[0] !== ipNetwork
        }
      } else if (privateIp && category === 'private') {
        ipNetwork = ips[1]
        for (let i in privateIp) {
          isIpInNetwork = (privateIp[i].split('.')[1] !== ipNetwork) || (privateIp[i].split('.')[0] !== ips[0])
        }
      } else {
        ipNetwork = ips[1]
        for (let i in privateIp) {
          isIpInNetwork = (privateIp[i].split('.')[1] !== ipNetwork) 
          || (privateIp[i].split('.')[0] !== ips[0])
          if (!isIpInNetwork) {
            isIpInNetwork = (privateIp[i].split('.')[2] > 3)
          }
        }
      }
      if (privateIp == undefined || privateIp == '') return null;
      return isIpInNetwork ? {isNotMatch: true} : null;
    }
    return null;
  }
}