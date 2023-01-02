import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function autoCompleteValidator(options: any[], displayColumnName: string = 'name'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectboxValue = typeof control.value === 'string' ? control.value : control.value[displayColumnName];
    if (selectboxValue == undefined || selectboxValue == '') return null;
    const pickedOrNot = options.filter(
      (option: any) => option[displayColumnName] === selectboxValue
    );
    return pickedOrNot.length > 0 ? null : { isNotMatch: true }
  };
}