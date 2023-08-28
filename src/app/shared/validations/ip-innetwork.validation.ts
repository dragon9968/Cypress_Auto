import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ErrorMessages } from "../enums/error-messages.enum";
import { matches } from 'ip-matching';
import { isIPv4 } from 'is-ip';

export const ipInNetworkValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const publicNetworkCtr = control.get('publicNetworkCtr');
  const publicNetworkIPsCtr = control.get('publicNetworkIPsCtr');
  const privateNetworkCtr = control.get('privateNetworkCtr');
  const privateNetworkIPsCtr = control.get('privateNetworkIPsCtr');
  const managementNetworkCtr = control.get('managementNetworkCtr');
  const managementNetworkIPsCtr = control.get('managementNetworkIPsCtr');
  const publicNetwork = publicNetworkCtr?.value.includes('/') ? publicNetworkCtr?.value : publicNetworkCtr?.value + '/32';
  const publicNetworkIPs = publicNetworkIPsCtr?.value;
  const privateNetwork = privateNetworkCtr?.value.includes('/') ? privateNetworkCtr?.value : privateNetworkCtr?.value + '/32';
  const privateNetworkIPs = privateNetworkIPsCtr?.value;
  const managementNetwork = managementNetworkCtr?.value.includes('/') ? managementNetworkCtr?.value : managementNetworkCtr?.value + '/32';
  const managementNetworkIPs = managementNetworkIPsCtr?.value;
  const message = ErrorMessages.IP_IN_NETWORK;
  if (publicNetwork && publicNetworkIPs) {
    const isIpInPublicNetwork = validationIpInNetwork(publicNetwork, publicNetworkIPs);
    if (!isIpInPublicNetwork) {
      return { isNotMatchPublicNetwork: true, message };
    }
  } 
  if (privateNetwork && privateNetworkIPs) {
    const isIpInPrivateNetwork = validationIpInNetwork(privateNetwork, privateNetworkIPs);
    if (!isIpInPrivateNetwork) {
      return { isNotMatchPrivateNetwork: true, message };
    }
  }
  if (managementNetwork && managementNetworkIPs) {
    const isIpInManagementNetwork = validationIpInNetwork(managementNetwork, managementNetworkIPs);
    if (!isIpInManagementNetwork) {
      return { isNotMatchManagementNetwork: true, message };
    }
  }
  return null;
};


function validationIpInNetwork(network: string, ips: string) {
  let isIpInPublicNetwork = false;
  if (network && ips) {
    if (ips.includes(',')) {
      const networkIp = ips.split(',');
      for (let i in networkIp) {
        const ipAddress = networkIp[i]
        if (isIPv4(ipAddress)) {
          isIpInPublicNetwork = matches(ipAddress, network)
        }
      }
    } else {
      if (isIPv4(ips)) {
        isIpInPublicNetwork = matches(ips, network)
      }
    }
  }
  return isIpInPublicNetwork
}