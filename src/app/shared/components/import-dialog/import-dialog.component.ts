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
      if (this.pageName === PageName.DEVICE_TEMPLATE) {
        formData.append('device_id', this.data.deviceId);
      }
      this._getServiceByPageName(this.data.pageName)?.import(formData).pipe(
        catchError((error) => {
          this.toastr.error(`${this.title} failed!`, 'Error')
          return throwError(() => error)
        })
      ).subscribe((response: any) => {
        this._handleImportResponse(this.pageName, response)
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
  private _handleImportResponse(pageName: string, response: any) {
    switch (pageName) {
      case PageName.CONNECTION_PROFILE:
        this.serverConnectionService.updateConnectionStore(response.result)
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      case PageName.CONFIGURATION_TEMPLATE:
        this.configTemplateService.updateConfigTemplateStore(response.result)
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      case PageName.DEVICE:
        const newDevices = response.result
        if (newDevices.length > 0) {
          this.deviceService.updateDeviceStore(newDevices)
        }
        this._showToastrMessages(response.messages)
        this.dialogRef.close()
        break;
      case PageName.DEVICE_TEMPLATE:
        const newTemplates = response.result
        if (newTemplates.length > 0) {
          this.templateService.updateTemplateStore(newTemplates)
        }
        this._showToastrMessages(response.messages)
        this.dialogRef.close()
        break;
      case PageName.HARDWARE:
        const newHardware = response.result
        if (newHardware.length > 0) {
          this.hardwareService.updateHardwareStore(newHardware)
        }
        this._showToastrMessages(response.messages)
        this.dialogRef.close()
        break;
      case PageName.LOGIN_PROFILES:
        this._getServiceByPageName(this.data.pageName)?.getAll().subscribe((response: any) =>
          this.store.dispatch(retrievedLoginProfiles({ data: response.result }))
        );
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      case PageName.ROLES:
        this._getServiceByPageName(this.data.pageName)?.getAll().subscribe((response: any) =>
          this.store.dispatch(retrievedRole({ role: response.result }))
        );
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      case PageName.IMAGES:
        this.imageService.getByCategory('image').subscribe((response: any) =>
          this.store.dispatch(retrievedImages({data: response.result}))
        )
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      case PageName.ICON:
        this.imageService.getByCategory('icon').subscribe((response: any) =>
          this.store.dispatch(retrievedIcons({data: response.result}))
        )
        this.toastr.success(`${this.title} successfully`, 'Success')
        this.dialogRef.close()
        break;
      default:
        this.toastr.warning('Page name is not match', 'Warning');
    }
  }

  private _showToastrMessages(messages: string[]) {
    messages.map((message: string) => {
      if (message.includes('successfully')) {
        this.toastr.success(message, 'Success')
      } else {
        this.toastr.warning(message, 'Waring')
      }
    })
  }
}
