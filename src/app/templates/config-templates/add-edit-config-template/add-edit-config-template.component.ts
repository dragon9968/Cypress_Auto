import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";

@Component({
  selector: 'app-add-edit-config-template',
  templateUrl: './add-edit-config-template.component.html',
  styleUrls: ['./add-edit-config-template.component.scss']
})
export class AddEditConfigTemplateComponent implements OnInit {
  configTemplateForm!: FormGroup;
  errorMessages = ErrorMessages;
  isViewMode = false;
  constructor(
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditConfigTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpersService: HelpersService
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.configTemplateForm = new FormGroup({
      name: new FormControl({value: '', disabled: this.isViewMode},
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl({value: '', disabled: this.isViewMode})
    });
    if (this.data) {
      this.name?.setValue(this.data.genData.name);
      this.description?.setValue(this.data.genData.description);
    }
   }

   get name() {return this.configTemplateForm.get('name');}
   get description() {return this.configTemplateForm.get('description');}

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  addConfigTemplate() {
    if (this.configTemplateForm.valid) {
      const jsonDataValue = {
        name: this.name?.value,
        description: this.description?.value,
      }
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.configTemplateService.add(jsonData).subscribe({
        next: (rest) =>{
          this.toastr.success(`Add Configuration Template successfully`);
          this.dialogRef.close();
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        },
        error:(err) => {
          this.toastr.error(`Error while add Configuration Template`);
        }
      });
    }
  }

  updateConfigTemplate() {
    if (this.configTemplateForm.valid) {
      const jsonDataValue = {
        name: this.name?.value,
        description: this.description?.value,
      };
      const jsonData = this.helpersService.removeLeadingAndTrailingWhitespace(jsonDataValue);
      this.configTemplateService.put(this.data.genData.id, jsonData).subscribe({
        next: (rest) =>{
          this.toastr.success(`Update Configuration Template successfully`);
          this.dialogRef.close();
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        },
        error:(err) => {
          this.toastr.error(`Error while update Configuration Template`);
        }
      });
    }
  }
}
