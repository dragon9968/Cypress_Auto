import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HelpersService } from 'src/app/shared/services/helpers/helpers.service';
import { Store } from '@ngrx/store';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { retrievedNodeAdd } from 'src/app/shared/store/map-edit/map-edit.actions';

@Component({
  selector: 'app-tool-panel-edit',
  templateUrl: './tool-panel-edit.component.html',
  styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent {
  @Input() collectionId: any;
  @Input() devices!: any[];
  @Input() templates!: any[];
  @Input() filteredTemplates!: any[];
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

  constructor(
    private store: Store,
    public helper: HelpersService,
  ) {
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
      this.store.dispatch(retrievedNodeAdd({
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
    console.log(this.isCustomizePG);
  }

  addPrivatePG() {
    console.log(this.isCustomizePG);
  }

  addImage() {
    console.log(this.imageCtr.value);
  }
}
