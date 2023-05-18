import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ErrorMessages } from "../enums/error-messages.enum";

export const vlanValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const minVlanCtr = control.get('vlan_min')
  const maxVlanCtr = control.get('vlan_max')
  const minVlan = minVlanCtr?.value
  const maxVlan = maxVlanCtr?.value
  if (minVlan) {
    let message = ""
    if (maxVlan < 2 || maxVlan > 4094) {
      message = ErrorMessages.MIN_MAX_VALUE_2_4094
      return { isMaxVLANInValid: true, message }
    }
    if (minVlan > maxVlan) {
      message = ErrorMessages.VLAN_MAX_GREATER_THAN_MIN
      return { isVlanInvalid: true, message }
    }
  }

  return null;
}
