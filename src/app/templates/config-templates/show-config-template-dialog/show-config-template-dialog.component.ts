import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { ConfigTemplateService } from 'src/app/core/services/config-template/config-template.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { retrievedConfigTemplates } from 'src/app/store/config-template/config-template.actions';

@Component({
  selector: 'app-show-config-template-dialog',
  templateUrl: './show-config-template-dialog.component.html',
  styleUrls: ['./show-config-template-dialog.component.scss']
})
export class ShowConfigTemplateDialogComponent implements OnInit {
  configForm!: FormGroup;
  isShowConfig = true;
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
    private toastr: ToastrService,
    private store: Store,
    private configTemplateService: ConfigTemplateService,
    public dialogRef: MatDialogRef<ShowConfigTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.configForm = new FormGroup({
      name: new FormControl({value: '', disabled: false}),
      category: new FormControl({value: '', disabled: false}),
      description: new FormControl({value: '', disabled: false}),
      configuration: new FormControl({value: '', disabled: false}),
    });
    if (this.data){
      this.name?.setValue(this.data.genData.name);
      this.category?.setValue(this.data.genData.category);
      this.description?.setValue(this.data.genData.description);
      const config = this.data.genData.configuration
      if (config){
        if (config.static_routes) {
          this.isShowConfig = false;
          Object.values(config.static_routes).forEach(val => {
            this.staticRoles.push(val)
          });
        }
        if (config.join_domain) {
          this.isShowConfig = false;
          this.joinDomain = this.data.genData.configuration.join_domain
          this.OuPath = this.data.genData.configuration.ou_path
        }
        if (config.firewall_rule) {
          this.isShowConfig = false;
          Object.values(config.firewall_rule).forEach((val: any) => {
            if (val.category === "rule") {
              this.fileWallRule.push(val)
            }else {
              this.fileWallPort.push(val)
            }
          });
        }
        if (config.role_services) {
          this.isShowConfig = false;
          Object.values(config.role_services).forEach((val: any) => {
            this.rolesOrServices.push(val);
          });
        }
      }
    }
   }

   get name() {return this.configForm.get('name');}
   get category() {return this.configForm.get('category');}
   get description() {return this.configForm.get('description');}
   get configuration() {return this.configForm.get('configuration');}
   get tags() {return this.configForm.get('tags');}

  ngOnInit(): void {
  }

  openConfigTemplate() {
    
  }

  onCancel() {
    this.dialogRef.close()
  }


  edit(i: any, event: any) {
    var id = event.currentTarget.id;
    console.log(i)
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
            this.toastr.success(`Delete Configuration Template successfully`);
            this.dialogRef.close();
            this.configTemplateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({data: data.result})));
          },
          error: (error) => {
            this.toastr.error(`Error while delete Configuration Template`);
          }
        })
      }
    });
  }

}