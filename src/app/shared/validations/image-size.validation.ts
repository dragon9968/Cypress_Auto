import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import { MAX_IMAGE_SIZE } from "../contants/image.constant"

export function imageSizeValidator(file: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const maxSize = MAX_IMAGE_SIZE
    const sizeFileInMb = Math.round(file.size / 1024)
    if (sizeFileInMb < maxSize) {
      return null
    } else {
      return { isNotMatchSize: true }
    }
  }
}