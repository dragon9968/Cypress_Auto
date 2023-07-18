import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { ErrorMessages } from "../enums/error-messages.enum";

export function vlanInterfaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const vlanId = control.value
    let message = ''
    let pattern = '^[0-9-,]*$'
    if (vlanId == '') {
      return null;
    }
    if (vlanId && vlanId.includes(',')) {
      const vlan = vlanId.split(',');
      for (let i in vlan) {
        const vlanValue = vlan[i]
        if (!vlanValue) {
          message = ErrorMessages.FIELD_IS_NUMBER
          return { isNotMatch: true, value: message }
        } else if (vlanValue && !vlanValue.match(pattern)) {
          message = ErrorMessages.FIELD_IS_NUMBER
          return { isNotMatch: true, value: message }
        } else if (vlanValue < 0 || vlanValue > 4095) {
          message = ErrorMessages.VLAN_RANGE_VALUE_0_4095
          return { isNotMatch: true, value: message }
        } else if (vlanValue.includes('-')) {
          const data = validationRangeVlan(message, vlanValue)
          const isNotMatch = data?.isNotMatch
          const msg = data?.value
          if (isNotMatch) {
            return { isNotMatch: isNotMatch, value: msg }
          }
        }
      }
    } else if (vlanId && vlanId.includes('-')) {
      const data = validationRangeVlan(message, vlanId)
      const isNotMatch = data?.isNotMatch
      const msg = data?.value
      if (isNotMatch) {
        return { isNotMatch: isNotMatch, value: msg }
      }
    } else if (vlanId < 0 || vlanId > 4095) {
      message = ErrorMessages.VLAN_RANGE_VALUE_0_4095
      return { isNotMatch: true, value: message }
    } else if (vlanId && !vlanId.match(pattern)) {
      message = ErrorMessages.FIELD_IS_NUMBER
      return { isNotMatch: true, value: message }
    }
    return null;
  }
}

function validationRangeVlan(message: string, vlan: string) {
  const rangeVlan = vlan.split('-');
  const pattern = '^[0-9-,]*$'
  const rangeVlanMin = rangeVlan[0];
  const rangeVlanMax = rangeVlan[1];
  const vlanMin = Number(rangeVlan[0]);
  const vlanMax = Number(rangeVlan[1]);
  if (rangeVlan.length > 2) {
    message = ErrorMessages.FIELD_IS_NUMBER
    return { isNotMatch: true, value: message }
  } else if (!rangeVlanMin || !rangeVlanMax || !rangeVlanMin.match(pattern) || !rangeVlanMax.match(pattern)) {
    message = ErrorMessages.FIELD_IS_NUMBER
    return { isNotMatch: true, value: message }
  } else if (vlanMin < 0 || vlanMax > 4095) {
    message = ErrorMessages.VLAN_RANGE_VALUE_0_4095
    return { isNotMatch: true, value: message }
  } else if (vlanMin >= vlanMax) {
    message = ErrorMessages.VLAN_MAX_GREATER_THAN_MIN
    return { isNotMatch: true, value: message }
  } else {
    return null
  }
}
