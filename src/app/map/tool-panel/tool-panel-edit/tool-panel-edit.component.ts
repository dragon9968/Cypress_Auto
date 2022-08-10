import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { selectTemplates } from 'src/app/store/template/template.selectors';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Component({
  selector: 'app-tool-panel-edit',
  templateUrl: './tool-panel-edit.component.html',
  styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent {
  @Input() cy: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterface: any[] = [];
  @Input() isDisableAddNode = false;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = false;
  deviceCtr = new FormControl();
  templateCtr = new FormControl();
  imageCtr = new FormControl();
  isCustomizeNode = true;
  isCustomizePG = true;
  images: any[];
  errorMessages = ErrorMessages;
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();
  devices!: any[];
  templates!: any[];
  filteredTemplates!: any[];
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  constructor(
    private store: Store,
    public helpers: HelpersService,
  ) {
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      this.devices = devices;
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
    this.images = [
      { id: "v1", name: "Name 1" },
      { id: "v2", name: "Name 2" },
      { id: "v3", name: "Name 3" },
    ];
  }

  selectDevice($event: MatAutocompleteSelectedEvent) {
    this.filteredTemplates = this.templates.filter(template => template.device_id == $event.option.value.id);
    this.templateCtr.setValue('');
  }

  addNode() {
    if (this.deviceCtr.value && this.templateCtr.value) {
      this.store.dispatch(retrievedMapEdit({
        data: {
          isAddNode: true,
          deviceId: this.deviceCtr.value.id,
          templateId: this.templateCtr.value.id,
          isCustomizeNode: this.isCustomizeNode
        }
      }));
    }
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
    console.log(this.imageCtr.value);
  }

  deleteNodes() {
    this.activeNodes.concat(this.activePGs, this.activeGBs).forEach((node: any) => {
      this.helpers.removeNode(node, this.deletedNodes, this.deletedInterface);
    });
    if (this.isGroupBoxesChecked) {
      this.cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
        if (gb.children().length == 0) {
          this.helpers.removeNode(gb, this.deletedNodes, this.deletedInterface);
        }
      });
    }
    this.activeNodes = [];
    this.activePGs = [];
    this.activeGBs = [];
    // this.update_components();
  }
}
