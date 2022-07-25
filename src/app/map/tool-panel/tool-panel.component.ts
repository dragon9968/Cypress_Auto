import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss']
})
export class ToolPanelComponent {
  @Input() cy: any;
  @Input() config: any;
  @Input() collectionId: any;
  @Input() devices!: any[];
  @Input() templates!: any[];
  @Input() filteredTemplates!: any[];
  @Input() isDisableCancel = true;
  @Input() isDisableAddNode = false;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = false;

  constructor() { }

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
    console.log('cancelEditMap');
  }
}
