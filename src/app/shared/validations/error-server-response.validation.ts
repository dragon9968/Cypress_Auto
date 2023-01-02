import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function showErrorFromServer(genData: () => any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const data = [...genData()];
    const valueCtr = control.value;
    let errorShow;
    data.forEach(ele => {
      if (ele.valueCtr == valueCtr) {
        errorShow = ele.error;
      }
    })
    return errorShow ? { errorServerExist: errorShow } : null ;
  }
}
