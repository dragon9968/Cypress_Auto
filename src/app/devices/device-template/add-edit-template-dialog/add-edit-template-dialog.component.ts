import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { IconService } from 'src/app/core/services/icon/icon.service';
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { selectIcons } from 'src/app/store/icon/icon.selectors';
import { selectLoginProfiles } from 'src/app/store/login-profile/login-profile.selectors';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';

@Component({
  selector: 'app-add-edit-template-dialog',
  templateUrl: './add-edit-template-dialog.component.html',
  styleUrls: ['./add-edit-template-dialog.component.scss']
})
export class AddEditTemplateDialogComponent implements OnInit, OnDestroy {
  templateForm!: FormGroup;
  selectIcons$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  listIcon!: any[];
  listLoginProfiles!: any[];
  selectedFile: any = null;
  constructor(
    private store: Store,
    public helpers: HelpersService,
    private toastr: ToastrService,
    private templateService: TemplateService,
    private iconService: IconService,
    private loginProfileService: LoginProfileService,
    public dialogRef: MatDialogRef<AddEditTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.listIcon = icons;
    })
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe(loginProfile => {
      this.listLoginProfiles = loginProfile;
    })

    this.templateForm = new FormGroup({
      displayName: new FormControl({value: '', disabled: false}),
      name: new FormControl({value: '', disabled: false}, [Validators.required, Validators.minLength(3), 
        Validators.maxLength(50)]),
      category: new FormControl(['vm']),
      icon: new FormControl(''),
      loginProfile: new FormControl({value: '', disabled: false}),
      defaultConfigFile: new FormControl({value: '', disabled: false}),
    })
  }
  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
  }

  get displayName() {return this.templateForm.get('displayName')}
  get name() {return this.templateForm.get('name')}
  get category() {return this.templateForm.get('category')}
  get icon() { return this.helpers.getAutoCompleteCtr(this.templateForm.get('icon'), this.listIcon); }
  get loginProfile() {return this.helpers.getAutoCompleteCtr(this.templateForm.get('loginProfile'), this.listLoginProfiles);}
  get defaultConfigFile() { return this.templateForm.get('defaultConfigFile') }

  ngOnInit(): void {
    this.displayName?.setValue(this.data.genData.display_name)
    this.name?.setValue(this.data.genData.name)
    this.category?.setValue(this.data.genData.category)
    this.helpers.setAutoCompleteValue(this.icon, this.listIcon, this.data.genData.icon.id);
    this.helpers.setAutoCompleteValue(this.loginProfile, this.listLoginProfiles, this.data.genData.login_profile_id);
  }

  onCancel() {
    this.dialogRef.close();
  }

  addTemplate() {
    const jsonData = {
      display_name: this.displayName?.value,
      name: this.name?.value,
      category: this.category?.value,
      device_id: this.data.genData.deviceId,
      icon_id: this.icon?.value.id,
      login_profile_id: this.loginProfile?.value.id
    }
    this.templateService.add(jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Add Template successfully`)
        this.dialogRef.close();
      },
      error: (err) => {
        this.toastr.error(`Error while add Template`);
      }
    });
  }

  updateTemplate() {
    const jsonData = {
      display_name: this.displayName?.value,
      name: this.name?.value,
      category: this.category?.value,
      device_id: this.data.deviceId,
      icon_id: this.icon?.value.id,
      login_profile_id: this.loginProfile?.value.id
    }
    this.templateService.put(this.data.genData.id, jsonData).subscribe({
      next: (rest) => {
        this.toastr.success(`Update Template successfully`)
        this.dialogRef.close();
      },
      error: (err) => {
        this.toastr.error(`Error while update Template`);
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

}
