import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
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
  configurationHtml!: SafeHtml; 
  staticRoles: any[] = [];
  fileWallRule: any[] = [];
  fileWallPort: any[] = [];
  rolesOrServices: any[] = [];
  joinDomain: any;
  OuPath: any;
  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private configTemplateService: ConfigTemplateService,
    private toastr: ToastrService,
    private store: Store,
    public dialogRef: MatDialogRef<AddEditConfigTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public helpersService: HelpersService
  ) {
    this.isViewMode = this.data.mode == 'view';
    this.configTemplateForm = new FormGroup({
      name: new FormControl({value: '', disabled: false},
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl({value: '', disabled: false}),
      category: new FormControl({value: '', disabled: false}),
      configuration: new FormControl({value: '', disabled: false}),
    });
    if (this.data){
      this.name?.setValue(this.data.genData.name);
      this.category?.setValue(this.data.genData.category);
      this.description?.setValue(this.data.genData.description);
      const config = this.data.genData.configuration
      if (config){
        if (config.static_routes?.length > 0) {
          Object.values(config.static_routes).forEach(val => {
            this.staticRoles.push(val)
          });
        }
        if (config.join_domain) {
          this.joinDomain = this.data.genData.configuration.join_domain
          this.OuPath = this.data.genData.configuration.ou_path
        }
        if (config.firewall_rule?.length > 0) {
          Object.values(config.firewall_rule).forEach((val: any) => {
            if (val.category === "rule") {
              this.fileWallRule.push(val)
            }else {
              this.fileWallPort.push(val)
            }
          });
        }
        if (config.role_services?.length > 0) {
          Object.values(config.role_services).forEach((val: any) => {
            this.rolesOrServices.push(val);
          });
        }
      }
    }
   }

  get name() {return this.configTemplateForm.get('name');}
  get category() {return this.configTemplateForm.get('category');}
  get description() {return this.configTemplateForm.get('description');}
  get configuration() {return this.configTemplateForm.get('configuration');}

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

  edit(i: any, event: any) {
    var id = event.currentTarget.id;
    const dialogData = {
      title: 'User confirmation needed',
      message: 'You sure you want to delete this item?'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { width: '400px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const jsonData = {
          category: id,
          num: i
        }
        this.configTemplateService.deleteConfiguration(this.data.genData.id, jsonData).subscribe({
          next: (rest) => {
            if (jsonData.category == "static_route") {
              this.toastr.success("Delete Static Routes successfully");
            } else if (jsonData.category == "domain_membership" || jsonData.category == "ou_path") {
              this.toastr.success("Delete Domain Membership successfully");
            } else if (jsonData.category == "firewall_rule") {
              this.toastr.success("Delete Firewall Rules successfully");
            } else if (jsonData.category == "role_services") {
              this.toastr.success("Delete Roles & Services successfully");
            } else {
              this.toastr.success("Delete Configuration Template successfully");
            }
            this.dialogRef.close();
            this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
          },
          error: (error) => {
            if (jsonData.category == "static_route") {
              this.toastr.success("Error while deleting Static Routes");
            } else if (jsonData.category == "domain_membership" || jsonData.category == "ou_path") {
              this.toastr.success("Error while deleting Domain Membership");
            } else if (jsonData.category == "firewall_rule") {
              this.toastr.success("Error while deleting Firewall Rules");
            } else if (jsonData.category == "role_services") {
              this.toastr.success("Error while deleting Roles & Services");
            } else {
              this.toastr.success("Error while deleting Configuration Template");
            }
          }
        })
      }
    });
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }
}
