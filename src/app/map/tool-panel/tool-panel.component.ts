import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';

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
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterface: any[] = [];
  @Input() deletedTunnel: any[] = [];

  constructor(private store: Store) { }

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
