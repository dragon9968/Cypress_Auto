import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { selectLoginProfiles } from 'src/app/store/login-profile/login-profile.selectors';
import { retrievedTemplatesByDevice } from "../../../store/template/template.actions";
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { validateNameExist } from 'src/app/shared/validations/name-exist.validation';

@Component({
  selector: 'app-add-edit-template-dialog',
  templateUrl: './add-edit-template-dialog.component.html',
  styleUrls: ['./add-edit-template-dialog.component.scss']
})
export class AddEditTemplateDialogComponent implements OnInit, OnDestroy {
  templateForm!: FormGroup;
  errorMessages = ErrorMessages;
  selectIcons$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  selectTemplates$ = new Subscription();
  icons!: any[];
  loginProfiles!: any[];
  listTemplate!: any[];
  selectedFile: any = null;
  filteredIcons!: Observable<any[]>;
  filteredLoginProfiles!: Observable<any[]>;
  ICON_PATH = ICON_PATH;

  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private templateService: TemplateService,
    public dialogRef: MatDialogRef<AddEditTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.selectTemplates$= this.store.select(selectTemplates).subscribe(templateData => {
      this.listTemplate = templateData;
    })

    this.templateForm = new FormGroup({
      displayNameCtr: new FormControl({ value: '', disabled: false }),
      nameCtr: new FormControl({ value: '', disabled: false },[
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        validateNameExist(() => this.listTemplate, this.data.mode, this.data.genData.id)
      ]),
      categoryCtr: new FormControl(['vm']),
      iconCtr: new FormControl(''),
      loginProfileCtr: new FormControl({ value: '', disabled: false }),
      defaultConfigFileCtr: new FormControl({ value: '', disabled: false }),
      versionCtr: new FormControl({ value: '', disabled: false })
    })
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.icons = icons;
      this.iconCtr.setValidators([autoCompleteValidator(this.icons)]);
      this.filteredIcons = this.helpers.filterOptions(this.iconCtr, this.icons);
    })
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfiles => {
      this.loginProfiles = loginProfiles;
      this.loginProfileCtr.setValidators([autoCompleteValidator(this.loginProfiles)]);
      this.filteredLoginProfiles = this.helpers.filterOptions(this.loginProfileCtr, this.loginProfiles);
    })
  }
  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
    this.selectTemplates$.unsubscribe();
  }

  get displayNameCtr() { return this.templateForm.get('displayNameCtr') }
  get nameCtr() { return this.templateForm.get('nameCtr') }
  get categoryCtr() { return this.templateForm.get('categoryCtr') }
  get versionCtr() { return this.templateForm.get('versionCtr') }
  get iconCtr() { return this.helpers.getAutoCompleteCtr(this.templateForm.get('iconCtr'), this.icons); }
  get loginProfileCtr() { return this.helpers.getAutoCompleteCtr(this.templateForm.get('loginProfileCtr'), this.loginProfiles); }
  get defaultConfigFileCtr() { return this.templateForm.get('defaultConfigFileCtr') }

  ngOnInit(): void {
    this.displayNameCtr?.setValue(this.data.genData.display_name)
    this.nameCtr?.setValue(this.data.genData.name)
    this.categoryCtr?.setValue(this.data.genData.category)
    this.versionCtr?.setValue(this.data.genData.version)
    this.helpers.setAutoCompleteValue(this.iconCtr, this.icons, this.data.genData.icon.id);
    this.helpers.setAutoCompleteValue(this.loginProfileCtr, this.loginProfiles, this.data.genData.login_profile_id);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addTemplate() {
    const jsonDataValue = {
      display_name: this.displayNameCtr?.value,
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value,
      version: this.versionCtr?.value,
      device_id: this.data.genData.deviceId,
      icon_id: this.iconCtr?.value.id,
      login_profile_id: this.loginProfileCtr?.value.id
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.templateService.add(jsonData).subscribe({
      next: () => {
        this.templateService.getAll().subscribe((data: any) => {
          let templateData = data.result.filter((val: any) => val.device_id === this.data.genData.deviceId);
          this.store.dispatch(retrievedTemplatesByDevice({ templatesByDevice: templateData }));
        })
        this.toastr.success('Added template successfully', 'Success')
        this.dialogRef.close();
      },
      error: () => {
        this.toastr.error('Add template failed', 'Error');
      }
    });
  }

  updateTemplate() {
    const jsonDataValue = {
      display_name: this.displayNameCtr?.value,
      name: this.nameCtr?.value,
      category: this.categoryCtr?.value,
      version: this.versionCtr?.value,
      device_id: this.data.deviceId,
      icon_id: this.iconCtr?.value.id,
      login_profile_id: this.loginProfileCtr?.value.id ? this.loginProfileCtr?.value.id : null
    }
    const jsonData = this.helpers.removeLeadingAndTrailingWhitespace(jsonDataValue);
    this.templateService.put(this.data.genData.id, jsonData).subscribe({
      next: () => {
        this.templateService.getAll().subscribe((data: any) => {
          let templateData = data.result.filter((val: any) => val.device_id === this.data.deviceId);
          this.store.dispatch(retrievedTemplatesByDevice({ templatesByDevice: templateData }));
        })
        this.toastr.success('Updated template successfully', 'Success')
        this.dialogRef.close();
      },
      error: () => {
        this.toastr.error('Update template failed', 'Error');
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

}
