import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectDevices } from 'src/app/store/device/device.selectors';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectTemplates } from 'src/app/store/template/template.selectors';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss']
})
export class ToolPanelComponent {
  @Input() cy: any;
  @Input() config: any;
  @Input() collectionId: any;
  @Input() isDisableCancel = true;
  @Input() isDisableAddNode = false;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = false;
  devices!: any[];
  templates!: any[];
  filteredTemplates!: any[];
  selectDevices$ = new Subscription();
  selectTemplates$ = new Subscription();

  constructor(private store: Store) {
    this.selectDevices$ = this.store.select(selectDevices).subscribe((devices: any) => {
      this.devices = devices;
    });
    this.selectTemplates$ = this.store.select(selectTemplates).subscribe((templates: any) => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
  }

  downloadMap() {
    console.log('downloadMap');
  }

  saveMap() {
    console.log('saveMap');
  }

  refreshMap() {
    console.log('refreshMap');
  }

  undoMap() {
    console.log('undoMap');
  }

  redoMap() {
    console.log('redoMap');
  }

  cancelEditMap() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddNode: false,
        isAddPublicPG: false,
        isAddPrivatePG: false,
      }
    }));
  }
}
