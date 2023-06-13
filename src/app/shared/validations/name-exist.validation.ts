import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateNameExist(getData: () => any[], mode: string, id: any, displayColumnName: string = 'name'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nameValue = control.value;
    if (nameValue == undefined || typeof nameValue !== 'string' || nameValue == '') {
      return null;
    }
    let data: any[] = [...getData()];
    if (mode === 'update' || mode === 'view') {
      const index = data.findIndex(ele => ele.id === id);
      data.splice(index, 1);
    }
    const isExistName = data.some((ele: any) => ele[displayColumnName] === nameValue.trim());
    return isExistName ? {isExist: true} : null;
  }
}
