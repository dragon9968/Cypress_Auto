import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
  selector: 'app-add-edit-config-template',
  templateUrl: './add-edit-config-template.component.html',
  styleUrls: ['./add-edit-config-template.component.scss']
})
export class AddEditConfigTemplateComponent implements OnInit, AfterViewInit {
  @ViewChild("editor") editor: any;
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
  defaultConfig: any = {}
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

  ngAfterViewInit(): void {
    if (this.data.mode !== 'add') {
      this.editor.getEditor().setOptions({
        tabSize: 2,
        useWorker: false,
        fontSize: '16px'
      });
      this.editor.mode = 'json';
      this.editor.setTheme('textmate');
      setTimeout(() => {
        const data = {
          config_id: this.data.genData.id,
          node_id: undefined
        }
        this.configTemplateService.getNodeDefaultConfiguration(data).subscribe(res => {
          this.defaultConfig = res.configuration;
          this.editor.value = JSON.stringify(this.defaultConfig, null, 2);
        })
      }, 0)
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
      this.configTemplateService.put(this.data.genData.id, jsonData).pipe(
        catchError(err => {
          this.toastr.error('Update configuration template failed!', 'Error');
          return throwError(() => err)
        })
      ).subscribe(() => {
        const isUpdateConfigDefault = JSON.stringify(this.defaultConfig, null, 2) !== this.editor.value;
        if (isUpdateConfigDefault) {
          const isNodeConfigDataFormatted = this.helpersService.validateJSONFormat(this.editor.value)
          if (isNodeConfigDataFormatted) {
            const configDefaultNode = {
              node_id: undefined,
              config_id: this.data.genData.id,
              ...JSON.parse(this.editor.value)
            }
            this.configTemplateService.putConfiguration(configDefaultNode).pipe(
              catchError(err => {
                this.toastr.error('Update configuration template failed!', 'Error');
                return throwError(() => err)
              })
            ).subscribe(res => {
              this.toastr.success(`Update Configuration Template successfully`);
              this.dialogRef.close();
              this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
            })
          }
        } else {
          this.toastr.success(`Update Configuration Template successfully`);
          this.dialogRef.close();
          this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
        }
      });
    }
  }

  changeViewToEdit() {
    this.data.mode = 'update';
    this.isViewMode = false;
  }
}
