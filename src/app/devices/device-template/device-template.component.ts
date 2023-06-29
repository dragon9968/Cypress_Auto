import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { DeviceCategoryService } from 'src/app/core/services/device-category/device-category.service';
import { DeviceService } from 'src/app/core/services/device/device.service';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { ImageService } from 'src/app/core/services/image/image.service';
import { LoginProfileService } from 'src/app/core/services/login-profile/login-profile.service';
import { TemplateService } from 'src/app/core/services/template/template.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { retrievedDeviceCategories } from 'src/app/store/device-category/device-category.actions';
import { retrievedDevices } from 'src/app/store/device/device.actions';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { retrievedIcons } from 'src/app/store/icon/icon.actions';
import { retrievedLoginProfiles } from 'src/app/store/login-profile/login-profile.actions';
import { retrievedTemplates, retrievedTemplatesByDevice } from 'src/app/store/template/template.actions';
import { selectTemplates, selectTemplatesByDevice } from 'src/app/store/template/template.selectors';
import { AddEditDeviceDialogComponent } from './add-edit-device-dialog/add-edit-device-dialog.component';
import { AddEditTemplateDialogComponent } from './add-edit-template-dialog/add-edit-template-dialog.component';
import { selectIsDeviceChange } from "../../store/device-change/device-change.selectors";
import { retrievedIsDeviceChange } from "../../store/device-change/device-change.actions";
import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { catchError } from "rxjs/operators";
import { PageName } from "../../shared/enums/page-name.enum";
import { ImportDialogComponent } from "../../shared/components/import-dialog/import-dialog.component";

@Component({
  selector: 'app-device-template',
  templateUrl: './device-template.component.html',
  styleUrls: ['./device-template.component.scss']
})
export class DeviceTemplateComponent implements OnInit, OnDestroy {
  @ViewChild("agGrid1") agGrid1!: AgGridAngular;
  private gridApi!: GridApi;
  @ViewChild("agGrid2") agGrid2!: AgGridAngular;
  isDisableTemplate = true;
  deviceId!: string;
  quickFilterValueDevices = '';
  quickFilterValueTemplates = '';
  rowsSelectedTemplate: any[] = [];
  rowsSelectedTemplateId: any[] = [];
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectIsDeviceChange$ = new Subscription();
  rowDataDevices$! : Observable<any[]>;
  rowDataTemplate$! : Observable<any[]>;
  id!: any;
  rowSelectedDevice: any[] = [];
  rowSelectedDeviceId: any[] = [];
  exportType!: string;
  isHiddenTable = true
  ICON_PATH = ICON_PATH;
  large: boolean = true;
  templateDevices: any[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    resizable: true
  };
  columnDefsDevices: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 20
    },
    {
      headerName: '',
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    { field: 'name',
      suppressSizeToFit: true,
      flex: 1,
    },
    {
      field: 'category',
      headerName: 'Category',
      suppressSizeToFit: true,
      flex: 1,
      valueGetter: function(param: any) {
        return `[${param.data.category.map((cat: any) => cat.name).join(", ")}]`
      },
    },
    {
      headerName: 'Icon',
      field: 'icon.photo',
      suppressSizeToFit: true,
      cellRenderer: function(param: any) {
        return param.value ? `<img src="${ICON_PATH}${param.value}" alt="Photo" height="25" width="25">` : 'None'
      },
      autoHeight: true,
      flex: 1,
      sortable: false,
      getQuickFilterText: () => ''
    }
  ];

  columnDefsTemplate: ColDef[] = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      suppressSizeToFit: true,
      width: 52
    },
    {
      field: 'id',
      hide: true,
      getQuickFilterText: () => ''
    },
    {
      headerName: 'Display Name',
      field: 'display_name',
      suppressSizeToFit: true,
      flex: 1,
    },
    { field: 'name',
      suppressSizeToFit: true,
      flex: 1,
    },
    { field: 'category',
      suppressSizeToFit: true,
      flex: 1,
    },
    {
      headerName: 'Icon',
      field: 'icon.photo',
      cellRenderer: function(param: any) {
        return param.value ? `<img src="${ICON_PATH}${param.value}" alt="Photo" height="25" width="25">` : 'None'
      },
      autoHeight: true,
      suppressSizeToFit: true,
      flex: 1,
      sortable: false,
      getQuickFilterText: () => ''
    },
    {
      headerName: 'Login',
      field: 'login_profile',
      autoHeight: true,
      suppressSizeToFit: true,
      flex: 1,
      cellRenderer: function(param: any) {
        if (param.value) {
          return `<div>Username:${param.value.username}</div><div>Password:${param.value.password}</div>`;
        } else {
          return
        }
      },
    },
  ];
  constructor(
    private store: Store,
    private toastr: ToastrService,
    private deviceService: DeviceService,
    private deviceCategoryService: DeviceCategoryService,
    private templateService: TemplateService,
    private imageService: ImageService,
    private loginProfileService: LoginProfileService,
    private dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    private helpers: HelpersService,
  ) {
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devicesData: any) => {
      if (devicesData) {
        if (this.agGrid1) {
          this.agGrid1.api.setRowData(devicesData);
        } else {
          this.rowDataDevices$ = of(devicesData);
        }
        this.updateRowDevice();
      }
    });
    this.selectTemplates$ = this.store.select(selectTemplatesByDevice).subscribe((templatesByDeviceData: any) => {
      if (templatesByDeviceData) {
        if (this.agGrid2) {
          this.agGrid2.api.setRowData(templatesByDeviceData);
        } else {
          this.rowDataTemplate$ = of(templatesByDeviceData);
        }
        this.updateRowDeviceTemplate();
      }
    });
    this.selectIsDeviceChange$ = this.store.select(selectIsDeviceChange).subscribe(isDeviceChange => {
      if (isDeviceChange) {
        this.closeTemplateTable();
        this.store.dispatch(retrievedIsDeviceChange({data: false}));
      }
    })
    iconRegistry.addSvgIcon('export-json', this.helpers.setIconPath('/assets/icons/export-json.svg'));
   }

  ngOnInit(): void {
    this.deviceService.getAll().subscribe((data: any) => this.store.dispatch(retrievedDevices({data: data.result})));
    this.templateService.getAll().subscribe((data: any) => this.store.dispatch(retrievedTemplates({data: data.result})));
    this.imageService.getByCategory('icon').subscribe(data => {
      this.store.dispatch(retrievedIcons({data: data.result}));
    })
    this.loginProfileService.getAll().subscribe(data => {
      this.store.dispatch(retrievedLoginProfiles({data: data.result}));
    })
    this.deviceCategoryService.getAll().subscribe(deviceCategories => {
      this.store.dispatch(retrievedDeviceCategories({data: deviceCategories.result}));
    })
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectIsDeviceChange$.unsubscribe();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady2(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged() {
    this.id = this.agGrid1.api.getSelectedRows();
    if (this.id.length > 0) {
      this.isDisableTemplate = false;
      this.deviceId = this.id[0].id;
      this.templateService.getAll().subscribe((data: any)  => {
        const filteredTemplatesByDevice = data.result.filter((val: any) => val.device_id === this.deviceId)
        this.store.dispatch(retrievedTemplatesByDevice({ templatesByDevice: filteredTemplatesByDevice }))
      })
    } else {
      this.store.dispatch(retrievedTemplatesByDevice({ templatesByDevice: null }));
      this.isDisableTemplate = true;
    }
  }

  selectedRows() {
    this.rowsSelectedTemplate = this.agGrid2.api.getSelectedRows();
    this.rowsSelectedTemplateId = this.rowsSelectedTemplate.map(ele => ele.id);
  }

  selectedRowsDevice () {
    this.rowSelectedDevice = this.agGrid1.api.getSelectedRows();
    this.rowSelectedDeviceId = this.rowSelectedDevice.map(ele => ele.id);
    this.exportType = 'device'
    if (this.rowSelectedDeviceId.length == 0 ) {
      this.isHiddenTable = true;
      this.large = true;
    } else {
      this.isHiddenTable = false;
      this.large = false;
    }
  }

  addDevices() {
    const dialogData = {
      mode: 'add',
      genData: {
        name:  '',
        category: '',
        icon:  '',
      }
    }
    const dialogRef = this.dialog.open(AddEditDeviceDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  onQuickFilterInputDevices(event: any) {
    this.agGrid1.api.setQuickFilter(event.target.value);
  }

  onQuickFilterInputTemplate (event: any) {
    this.agGrid2.api.setQuickFilter(event.target.value);
  }

  addTemplate() {
    const dialogData = {
      mode: 'add',
      genData: {
        deviceId: this.id[0].id,
        displayName:  '',
        name: '',
        category:  'vm',
        icon:  '',
        loginProfile:  '',
        defaultConfigFile: '',
      }
    }
    const dialogRef = this.dialog.open(AddEditTemplateDialogComponent, {
      disableClose: true,
      autoFocus: false,
      width: '450px',
      data: dialogData
    });
  }

  exportDevice() {
    if (this.rowSelectedDeviceId.length == 0) {
      this.toastr.info('No row selected');
    }else {
      let file = new Blob();
      this.deviceService.export(this.rowSelectedDeviceId).subscribe(response => {
      file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
      this.helpers.downloadBlob('Devices-Export.json', file);
      this.toastr.success(`Exported Devices as ${'json'.toUpperCase()} file successfully`);
      })
    }
  }

  exportTemplate() {
    if (this.rowsSelectedTemplateId.length == 0) {
      this.toastr.info('No row selected');
    } else {
      let file = new Blob();
      this.templateService.export(this.rowsSelectedTemplateId).subscribe(response => {
      file = new Blob([JSON.stringify(response, null, 4)], {type: 'application/json'});
      this.helpers.downloadBlob('Templates-Export.json', file);
      this.toastr.success(`Exported Templates as ${'json'.toUpperCase()} file successfully`);
        })
      }
    }

  closeTemplateTable() {
    this.isDisableTemplate = true;
    this.large = true;
    this.isHiddenTable = true;
    this.agGrid1.api.deselectAll();
  }

  updateRowDevice() {
    if (this.rowSelectedDeviceId.length > 0 && this.agGrid1) {
      this.agGrid1.api.forEachNode(rowNode => {
        if (this.rowSelectedDeviceId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  updateRowDeviceTemplate() {
    if (this.rowsSelectedTemplateId.length > 0 && this.agGrid2) {
      this.agGrid2.api.forEachNode(rowNode => {
        if (this.rowsSelectedTemplateId.includes(rowNode.data.id)) {
          rowNode.setSelected(true);
        }
      })
    }
  }

  updateDevice() {
    if (this.rowSelectedDeviceId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowSelectedDeviceId.length === 1) {
      this.deviceService.get(this.rowSelectedDeviceId[0]).subscribe(deviceData => {
        const dialogData = {
          mode: 'update',
          genData: deviceData.result
        }
        const dialogRef = this.dialog.open(AddEditDeviceDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to the device.<br> Please select only one device',
                  'Info', { enableHtml: true})
    }
  }

  deleteDevice() {
    if (this.rowSelectedDeviceId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowSelectedDeviceId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowSelectedDevice.map(device => {
            this.deviceService.delete(device.id).pipe(
              catchError(response => {
                if (response.status == 400) {
                  const messages = response.error.message.split(':')[1];
                  this.toastr.warning(messages, 'Warning');
                } else {
                  this.toastr.error(`Delete ${device.name} device failed`, 'Error');
                }
                return throwError(() => response.error);
              })
            ).subscribe(response => {
              this.deviceService.getAll().subscribe(
                (data: any) => this.store.dispatch(retrievedDevices({ data: data.result }))
              );
              this.store.dispatch(retrievedIsDeviceChange({ data: true }));
              this.toastr.success(`Deleted ${device.name} device successfully`, 'Success');
            })
          })
          this.clearDeviceTable();
        }
      });
    }
  }

  updateTemplate() {
    if (this.rowsSelectedTemplateId.length === 0) {
      this.toastr.info('No row selected');
    } else if (this.rowsSelectedTemplateId.length === 1) {
      this.templateService.get(this.rowsSelectedTemplateId[0]).subscribe(templateData => {
        const dialogData = {
          mode: 'update',
          genData: templateData.result,
          deviceId: this.rowSelectedDeviceId[0]
        }
        this.dialog.open(AddEditTemplateDialogComponent, {
          disableClose: true,
          autoFocus: false,
          width: '450px',
          data: dialogData
        });
      })
    } else {
      this.toastr.info('Bulk edits do not apply to template.<br> Please select only one template', 'Info',
              { enableHtml: true })
    }
  }

  deleteTemplate() {
    if (this.rowsSelectedTemplateId.length === 0) {
      this.toastr.info('No row selected');
    } else {
      const suffix = this.rowsSelectedTemplateId.length === 1 ? 'this item' : 'these items';
      const dialogData = {
        title: 'User confirmation needed',
        message: `Are you sure you want to delete ${suffix}?`,
        submitButtonName: 'OK'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.rowsSelectedTemplate.map(template => {
            this.templateService.delete(template.id).pipe(
              catchError(response => {
                if (response.status == 400) {
                  const message = response.error.message.split(':')[1];
                  this.toastr.warning(message, 'Warning');
                } else {
                  this.toastr.error(`Delete ${template.display_name} template failed`, 'Error');
                }
                return throwError(() => response.error);
              })
            ).subscribe(() => {
              this.templateService.getAll().subscribe((data: any)  => {
                const template = data.result.filter((ele: any) => ele.device_id === this.rowSelectedDeviceId[0]);
                this.store.dispatch(retrievedTemplatesByDevice({ templatesByDevice: template }));
              })
              this.toastr.success(`Delete ${template.display_name} template successfully`, 'Success');
            })
          })
          this.clearDeviceTemplateTable();
        }
      });
    }
  }

  clearDeviceTable() {
    this.agGrid1.api.deselectAll();
    this.rowSelectedDevice = [];
    this.rowSelectedDeviceId = [];
  }

  clearDeviceTemplateTable() {
    this.agGrid2.api.deselectAll();
    this.rowsSelectedTemplate = [];
    this.rowsSelectedTemplateId = [];
  }

  importDevice() {
    const dialogData = {
      pageName: PageName.DEVICE
    }
    this.dialog.open(ImportDialogComponent, {
      data: dialogData,
      disableClose: true,
      autoFocus: false,
      width: '450px'
    })
  }

  importTemplate() {
    const dialogData = {
      pageName: PageName.DEVICE_TEMPLATE,
      deviceId: this.deviceId
    }
    this.dialog.open(ImportDialogComponent, {
      data: dialogData,
      disableClose: true,
      autoFocus: false,
      width: '450px'
    })
  }
}
