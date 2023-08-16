import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { matches } from 'ip-matching';

export const ipInPortGroupSubnet: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const interfaceCtr = control.get('interfaceCtr');
  const targetPortGroupCtr = control.get('targetPortGroupCtr');
  const interfacesIp = interfaceCtr?.value.ip;
  const targetPG = targetPortGroupCtr?.value.subnet;
  if (interfacesIp && targetPG) {
    const checkIpInSubnet = matches(interfacesIp, targetPG)
    if (!checkIpInSubnet) {
      let message = "IP Address not contained in port group subnet";
      return { isNotMatch: true, message };
    }
  }
  return null;
};