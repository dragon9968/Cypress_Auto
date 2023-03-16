import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateInputFile(format: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const filename = control.value;
    if (!filename || filename.length == 0) {
      return null
    }
    if (format === 'json' && filename.endsWith('.json')) {
      return null
    } else if (format === 'md' && (filename.endsWith('.md') || filename.endsWith('.pdf'))) {
      return null
    } else if (format === 'json|csv' && (filename.endsWith('.json') || filename.endsWith('.csv'))) {
      return null
    } else if (format === 'png|jpg' && (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('jpeg'))) {
      return null
    } else {
      return { isNotFile: true }
    }
  }
}
