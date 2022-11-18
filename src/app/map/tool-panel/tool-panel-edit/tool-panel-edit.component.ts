import { Component, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { CMLockUnlockService } from '../../context-menu/cm-lock-unlock/cm-lock-unlock.service';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { CMGroupBoxService } from '../../context-menu/cm-groupbox/cm-groupbox.service';
import { ToastrService } from 'ngx-toastr';
import { autoCompleteValidator } from 'src/app/shared/validations/auto-complete.validation';
import { selectMapImages } from 'src/app/store/map-image/map-image.selectors';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';

@Component({
  selector: 'app-tool-panel-edit',
  templateUrl: './tool-panel-edit.component.html',
  styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnDestroy {
  @Input() cy: any;
  @Input() config: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() activeMBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() isDisableAddNode = true;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = false;
  nodeAddForm!: FormGroup;
  isCustomizePG = true;
  errorMessages = ErrorMessages;
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  selectMapImages$ = new Subscription();
  selectMapOption$ = new Subscription();
  selectMapPref$ = new Subscription();
  devices!: any[];
  templates!: any[];
  mapImages!: any[];
  filteredTemplates!: any[];
  isGroupBoxesChecked!: boolean;
  ICON_PATH = ICON_PATH;
  selectedMapPref: any;

  constructor(
    private store: Store,
    private cmLockUnlockService: CMLockUnlockService,
    public helpers: HelpersService,
    private commonService: CommonService,
    private cmGroupBoxService: CMGroupBoxService,
    private toastr: ToastrService
  ) {
    this.nodeAddForm = new FormGroup({
      deviceCtr: new FormControl(''),
      templateCtr: new FormControl(''),
      mapImageCtr: new FormControl(''),
      isCustomizeNodeCtr: new FormControl(true)
    });

    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      if (devices) {
        this.devices = devices;
        this.deviceCtr?.setValidators([autoCompleteValidator(this.devices)]);
      }
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      if (templates) {
        this.templates = templates;
        this.filteredTemplates = templates;
        this.templateCtr?.setValidators([autoCompleteValidator(this.templates, 'display_name')]);
      }
    });
    this.selectMapImages$ = this.store.select(selectMapImages).subscribe((mapImages: any) => {
      if (mapImages) {
        this.mapImages = mapImages;
        this.mapImageCtr?.setValidators([autoCompleteValidator(this.mapImages)]);
      }
    });
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((selectedMapPref: any) => {
      this.selectedMapPref = selectedMapPref;
    });
  }

  get deviceCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('deviceCtr'), this.devices); }
  get templateCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('templateCtr'), this.templates); }
  get mapImageCtr() { return this.helpers.getAutoCompleteCtr(this.nodeAddForm.get('mapImageCtr'), this.mapImages); }
  get isCustomizeNodeCtr() { return this.nodeAddForm.get('isCustomizeNodeCtr'); }

  ngOnInit(): void {
    this.templateCtr?.disable();
  }

  ngOnDestroy(): void {
    this.selectDevices$.unsubscribe();
    this.selectTemplates$.unsubscribe();
    this.selectMapOption$.unsubscribe();
  }



  disableTemplate(deviceId: string) {
    this.filteredTemplates = this.templates.filter(template => template.device.id == deviceId);
    this.templateCtr?.setValue('');
    this.isDisableAddNode = true;
    if (this.filteredTemplates.length > 0) {
      this.templateCtr?.enable();
    } else {
      this.templateCtr?.disable();
    }
  }

  changeDevice() {
    this.disableTemplate(this.deviceCtr?.value.id);
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.disableTemplate($event.option.value.id);
  }

  changeTemplate() {
    this.isDisableAddNode = false;
  }

  selectTemplate($event: MatAutocompleteSelectedEvent) {
    this.isDisableAddNode = false;
  }

  addNode() {
    this.isDisableAddNode = true;
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddNode: true,
        deviceId: this.deviceCtr?.value.id,
        templateId: this.templateCtr?.value.id,
        isCustomizeNode: this.isCustomizeNodeCtr?.value
      }
    }));
  }

  addPublicPG() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddPublicPG: true,
        isAddPrivatePG: false,
        isCustomizePG: this.isCustomizePG
      }
    }));
  }

  addPrivatePG() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddPublicPG: false,
        isAddPrivatePG: true,
        isCustomizePG: this.isCustomizePG
      }
    }));
  }

  addImage() {
    const mapImage = this.mapImages.filter(image => image.id === this.mapImageCtr.value.id)[0];
    const background = new Image();
    background.src = ICON_PATH + mapImage.photo;
    background.addEventListener("load", this.loadMapImage.bind(this, background));
  }

  loadMapImage(bg: any) {
    if (this.config.gb_exists) {
      if (!(this.cy.getElementById('default.test'))) {
        const gb = {
          data: Object.assign({
            id: 'default.test',
            domain_id: this.config.default_domain_id,
            label: "group_box"
          }, {
            "group_color": this.helpers.fullColorHex(this.selectedMapPref.group_box_color),
            "group_opacity": this.selectedMapPref.group_box_opacity,
            "border-width": "4",
            "text-valign": "top",
            "zIndex": 997
          }),
          position: {
            x: 0,
            y: 0
          },
          group: "nodes",
          removed: false,
          selected: false,
        };
        this.cy.add(gb);
      }
    }
    this.cy.add({
      group: "nodes",
      data: {
        "label": "map_background",
        "elem_category": "bg_image",
        "new": true,
        "updated": false,
        "deleted": false,
        "src": bg.src,
        "zIndex": 998,
        "width": bg.width,
        "height": bg.height,
        "locked": false
      },
      position: { x: 0, y: 0 }
    })[0];
  }

  deleteNodes() {
    this.commonService.delete(
      this.cy,
      this.activeNodes,
      this.activePGs,
      this.activeEdges,
      this.activeGBs,
    );
  }

  lockNodes() {
    this.cmLockUnlockService.lockNodes(this.cy, this.activeNodes, this.activePGs);
  }

  unlockNodes() {
    this.cmLockUnlockService.unlockNodes(this.activeNodes, this.activePGs);
  }

  collapse() {
    this.cmGroupBoxService.collapse(this.cy, this.activeGBs);
  }

  expand() {
    this.cmGroupBoxService.expand(this.cy, this.activeGBs);
  }

  increaseZIndex() {
    this.activeGBs.concat(this.activeMBs).map(ele => {
      this.cmGroupBoxService.moveUp(ele);
    });
  }

  decreaseZIndex() {
    this.activeGBs.concat(this.activeMBs).map(ele => {
      ele._private['data'] = { ...ele._private['data'] };
      const label = ele.data('label');
      if (label == 'map_background') {
        if (this.config.gb_exists) {
          const g = ele.parent();
          if (g.data('zIndex') == -998) {
            this.toastr.warning('group box zIndex out of bounds');
            return;
          }
          g.data('zIndex', g.data('zIndex') - 1);
        }
      } else {
        if (ele.data('zIndex') == -998) {
          this.toastr.warning('group box zIndex out of bounds');
          return;
        }
      }
      ele.data('zIndex', ele.data('zIndex') - 1);
    });
  }
}
