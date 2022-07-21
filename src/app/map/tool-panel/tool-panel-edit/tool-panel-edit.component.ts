import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateNodeDialogComponent } from './add-update-node-dialog/add-update-node-dialog.component';
import { HelpersService } from 'src/app/shared/services/helper/helpers.service';
import { IconService } from 'src/app/shared/services/icon/icon.service';
import { DeviceService } from 'src/app/shared/services/device/device.service';
import { TemplateService } from 'src/app/shared/services/template/template.service';
import { HardwareService } from 'src/app/shared/services/hardware/hardware.service';
import { DomainService } from 'src/app/shared/services/domain/domain.service';
import { ConfigTemplateService } from 'src/app/shared/services/config-template/config-template.service';
import { LoginProfileService } from 'src/app/shared/services/login-profile/login-profile.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDevices } from 'src/app/shared/store/device/device.selectors';
import { retrievedDevices } from 'src/app/shared/store/device/device.actions';
import { retrievedTemplates } from 'src/app/shared/store/template/template.actions';
import { selectTemplates } from 'src/app/shared/store/template/template.selectors';
import { retrievedIcons } from 'src/app/shared/store/icon/icon.actions';
import { retrievedHardwares } from 'src/app/shared/store/hardware/hardware.actions';
import { retrievedDomains } from 'src/app/shared/store/domain/domain.actions';
import { retrievedConfigTemplates } from 'src/app/shared/store/config-template/config-template.actions';
import { retrievedLoginProfiles } from 'src/app/shared/store/login-profile/login-profile.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { selectIcons } from 'src/app/shared/store/icon/icon.selectors';
import { selectHardwares } from 'src/app/shared/store/hardware/hardware.selectors';
import { selectDomains } from 'src/app/shared/store/domain/domain.selectors';
import { selectConfigTemplates } from 'src/app/shared/store/config-template/config-template.selectors';
import { selectLoginProfiles } from 'src/app/shared/store/login-profile/login-profile.selectors';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';

@Component({
  selector: 'app-tool-panel-edit',
  templateUrl: './tool-panel-edit.component.html',
  styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnInit, OnDestroy {
  @Input() collectionId: any;
  deviceCtr = new FormControl();
  templateCtr = new FormControl();
  imageCtr = new FormControl();
  isCustomizeNode = true;
  isCustomizePG = true;
  icons!: any[];
  devices!: any[];
  templates!: any[];
  hardwares!: any[];
  domains!: any[];
  configTemplates!: any[];
  loginProfiles!: any[];
  filteredTemplates!: any[];
  images: any[];
  selectIcons$ = new Subscription();
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectHardwares$ = new Subscription();
  selectDomains$ = new Subscription();
  selectConfigTemplates$ = new Subscription();
  selectLoginProfiles$ = new Subscription();
  errorMessages = ErrorMessages;

  constructor(
    private dialog: MatDialog,
    private store: Store,
    public helper: HelpersService,
  ) {
    this.images = [
      { id: "v1", name: "Name 1" },
      { id: "v2", name: "Name 2" },
      { id: "v3", name: "Name 3" },
    ];
    this.selectIcons$ = this.store.select(selectIcons).subscribe((icons: any) => {
      this.icons = icons;
    });
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      this.devices = devices;
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
    this.selectHardwares$ = this.store.select(selectHardwares).subscribe((hardwares: any) => {
      this.hardwares = hardwares;
    });
    this.selectDomains$ = this.store.select(selectDomains).subscribe((domains: any) => {
      this.domains = domains;
    });
    this.selectConfigTemplates$ = this.store.select(selectConfigTemplates).subscribe((configTemplates: any) => {
      this.configTemplates = configTemplates;
    });
    this.selectLoginProfiles$ = this.store.select(selectLoginProfiles).subscribe((loginProfiles: any) => {
      this.loginProfiles = loginProfiles;
    });
  }

  ngOnInit(): void {
   }

  ngOnDestroy(): void {
    this.selectIcons$.unsubscribe();
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectHardwares$.unsubscribe();
    this.selectDomains$.unsubscribe();
    this.selectConfigTemplates$.unsubscribe();
    this.selectLoginProfiles$.unsubscribe();
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.templates.filter(template => template.device_id == $event.option.value.id);
    this.templateCtr.setValue('');
  }

  addNode() {
    if (this.deviceCtr.value && this.templateCtr.value && this.isCustomizeNode) {
      const dialogData = {
        mode: 'add',
        collectionId: this.collectionId,
        device: this.deviceCtr.value.id,
        template: this.templateCtr.value.id,
        icons: this.icons,
        devices: this.devices,
        templates: this.templates,
        hardwares: this.hardwares,
        domains: this.domains,
        configTemplates: this.configTemplates,
        loginProfiles: this.loginProfiles,
      }
      this.dialog.open(AddUpdateNodeDialogComponent, { width: '500px', data: dialogData });
    } else {
    }
  }

  addPublicPG() {
    console.log(this.isCustomizePG);
  }

  addPrivatePG() {
    console.log(this.isCustomizePG);
  }

  addImage() {
    console.log(this.imageCtr.value);
  }
}
