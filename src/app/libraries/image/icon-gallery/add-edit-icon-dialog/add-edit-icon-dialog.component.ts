import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ImageService } from 'src/app/core/services/image/image.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { validateInputFile } from 'src/app/shared/validations/format-file.validation';
import { imageSizeValidator } from 'src/app/shared/validations/image-size.validation';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';

@Component({
  selector: 'app-add-edit-icon-dialog',
  templateUrl: './add-edit-icon-dialog.component.html',
  styleUrls: ['./add-edit-icon-dialog.component.scss']
})
export class AddEditIconDialogComponent implements OnInit {
  isViewMode = false;
  isChecked = false;
  isHiddenDeleteButton = false;
  selectedFile: any = null;
  iconForm!: FormGroup;
  errorMessages = ErrorMessages;
  ICON_PATH = ICON_PATH;
  url = null;
  url_default = null;
  selectedIcon!: any[];
  selectIcons$ = new Subscription();
  constructor(
    private imageService: ImageService,
    private toastr: ToastrService,
    private store: Store,
    private helpersService: HelpersService,
    public dialogRef: MatDialogRef<AddEditIconDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectIcons$ = this.store.select(selectIcons).subscribe(nameIcon => {
      this.selectedIcon = nameIcon;
    })
    this.isViewMode = this.data.mode == 'view';
    this.iconForm = new FormGroup({
      id: new FormControl({
        value: '', disabled: this.isViewMode
      }),
      name: new FormControl({
        value: '', disabled: this.isViewMode
      }, [Validators.required, validateNameExist(() => this.selectedIcon, this.data.mode, this.data.genData.id)]),
      photo: new FormControl({ value: '', disabled: this.isViewMode }),
      fileCtr: new FormControl('')
    })
    if (this.data) {
      this.id?.setValue(this.data.genData.id);
      this.name?.setValue(this.data.genData.name);
      this.photo?.setValue(this.data.genData.photo);
      this.url_default = this.data.genData.photo;
    }
  }

  get id() { return this.iconForm.get('id'); }
  get name() { return this.iconForm.get('name'); }
  get photo() { return this.iconForm.get('photo'); }
  get fileCtr() { return this.iconForm.get('fileCtr'); }

  ngOnInit(): void {
    this.isHiddenDeleteButton = true;
    if (this.data.mode === 'update') {
        if (this.data.genData.photo) {
          this.isHiddenDeleteButton = false;
        } else {
          this.isHiddenDeleteButton = true;
        }
        this.fileCtr?.setValidators([validateInputFile('png|jpg')]);
    } else if (this.data.mode === 'add') {
      this.fileCtr?.setValidators([Validators.required, validateInputFile('png|jpg')]);
    }
  }

  addIcon() {
    if (this.iconForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', this.name?.value.trim())
      formData.append('category', 'icon')
      this.imageService.add(formData).subscribe({
          next:(rest) => {
            this.dialogRef.close();
            this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
            this.toastr.success(`Added Icon successfully`);
          },
          error:(err) => {
            this.toastr.error(err.error.message);
          }
        })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
    if (event.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(this.selectedFile)
      reader.onload = (e: any) => {
        this.url = e.target.result;
        this.fileCtr?.setValidators([Validators.required, validateInputFile('png|jpg'), imageSizeValidator(this.selectedFile)]);
        this.fileCtr?.updateValueAndValidity();
      }
    }
  }

  updateIcon() {
    if (this.iconForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      formData.append('name', this.name?.value.trim());
      formData.append('category', 'icon')
      if (this.isChecked) {
        formData.append('checked', 'true');
      }
      else {
        formData.append('checked', 'false');
      }
      this.imageService.put(this.data.genData.id, formData).subscribe({
        next:(rest) => {
          this.dialogRef.close();
          this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})));
          this.toastr.success(`Update Icon successfully`);
        },
        error:(err) => {
          this.toastr.error(`Error while Update Icon`);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
    this.name?.enable();
    this.photo?.enable();
    this.isHiddenDeleteButton = false;
  }
}
