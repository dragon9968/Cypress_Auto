import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { validateInputFile } from "../../validations/format-file.validation";
import { PageName } from "../../enums/page-name.enum";
import { ServerConnectService } from "../../../core/services/server-connect/server-connect.service";
import { ConfigTemplateService } from "../../../core/services/config-template/config-template.service";
import { DeviceService } from "../../../core/services/device/device.service";
import { TemplateService } from "../../../core/services/template/template.service";
import { HardwareService } from "../../../core/services/hardware/hardware.service";
import { ToastrService } from "ngx-toastr";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';
import { Store } from '@ngrx/store';
import { RolesService } from 'src/app/core/services/roles/roles.service';
import { retrievedRole } from 'src/app/store/user/user.actions';
import { ImageService } from 'src/app/core/services/image/image.service';
import { retrievedImages } from 'src/app/store/map-image/map-image.actions';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {
  importForm!: FormGroup;
  selectedFile: any = null;
  title = ''
  pageName = ''
  constructor(
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImportDialogComponent>,
    private serverConnectionService: ServerConnectService,
    private configTemplateService: ConfigTemplateService,
    private deviceService: DeviceService,
    private templateService: TemplateService,
    private hardwareService: HardwareService,
    private loginProfileService: LoginProfileService,
    private rolesService: RolesService,
    private store: Store,
    private imageService: ImageService
  ) {
    this.pageName = this.data.pageName
    this._setTitle(this.pageName)
    this.importForm = new FormGroup({
      fileCtr: new FormControl('', [Validators.required, validateInputFile('json')])
    })
  }

  ngOnInit(): void {

  }

  get fileCtr() { return this.importForm.get('fileCtr');}

  import() {
    if (this.importForm.valid) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this._getServiceByPageName(this.data.pageName)?.import(formData).pipe(
        catchError((error) => {
          this.toastr.error(`${this.title} failed!`, 'Error')
          return throwError(() => error)
        })
      ).subscribe((response: any) => {
        if (response.result) {
          this._updateDataInStore(this.pageName, response.result)
        }
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
      })
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0] ?? null;
  }

  private _setTitle(pageName: string) {
    switch (pageName) {
      case PageName.CONNECTION_PROFILE:
        this.title = 'Import connection profile'
        break;
      case PageName.CONFIGURATION_TEMPLATE:
        this.title = 'Import configuration template';
        break;
      case PageName.DEVICE:
        this.title = "Import device";
        break;
      case PageName.DEVICE_TEMPLATE:
        this.title = "Import device template";
        break;
      case PageName.HARDWARE:
        this.title = "Import hardware";
        break;
      case PageName.LOGIN_PROFILES:
        this.title = "Import login profiles";
        break;
      case PageName.ROLES:
        this.title = "Import roles";
        break;
      case PageName.IMAGES:
        this.title = "Import images";
        break;
      case PageName.ICON:
        this.title = "Import icon";
        break;
      default:
        this.toastr.warning('Page name is not match', 'Warning')
    }
  }
  private _getServiceByPageName(pageName: string) {
    switch (pageName) {
      case PageName.CONNECTION_PROFILE:
        return this.serverConnectionService
      case PageName.CONFIGURATION_TEMPLATE:
        return this.configTemplateService
      case PageName.DEVICE:
        return this.deviceService
      case PageName.DEVICE_TEMPLATE:
        return this.templateService
      case PageName.HARDWARE:
        return this.hardwareService
      case PageName.LOGIN_PROFILES:
        return this.loginProfileService
      case PageName.ROLES:
        return this.rolesService
      case PageName.IMAGES:
        return this.imageService
      case PageName.ICON:
        return this.imageService
      default:
        this.toastr.warning('Page name is not match', 'Warning');
        return
    }
  }
  private _updateDataInStore(pageName: string, newItem: any) {
    switch (pageName) {
      case PageName.CONNECTION_PROFILE:
        this.serverConnectionService.updateConnectionStore(newItem)
        break;
      case PageName.CONFIGURATION_TEMPLATE:
        this.configTemplateService.updateConfigTemplate(newItem)
        break;
      case PageName.DEVICE:
        this.toastr.success(`${this.title}`, 'Success');
        break;
      case PageName.DEVICE_TEMPLATE:
        this.toastr.success(`${this.title}`, 'Success');
        break;
      case PageName.HARDWARE:
        this.toastr.success(`${this.title}`, 'Success');
        break;
      case PageName.LOGIN_PROFILES:
        this._getServiceByPageName(this.data.pageName)?.getAll().subscribe((data: any) => this.store.dispatch(retrievedLoginProfiles({ data: data.result })));
        break;
      case PageName.ROLES:
        this._getServiceByPageName(this.data.pageName)?.getAll().subscribe((data: any) => this.store.dispatch(retrievedRole({ role: data.result })));
        break;
      case PageName.IMAGES:
        this.imageService.getByCategory('image').subscribe((data: any) => this.store.dispatch(retrievedImages({data: data.result})))
        break;
      case PageName.ICON:
        this.imageService.getByCategory('icon').subscribe((data: any) => this.store.dispatch(retrievedIcons({data: data.result})))
        break;
      default:
        this.toastr.warning('Page name is not match', 'Warning');
    }
  }

}
