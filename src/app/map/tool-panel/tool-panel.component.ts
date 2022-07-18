import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-tool-panel',
    templateUrl: './tool-panel.component.html',
    styleUrls: ['./tool-panel.component.scss']
})
export class ToolPanelComponent implements OnInit {
    @Input() cy: any;
    @Input() config: any;
    @Input() collectionId: any;

    constructor() { }

    ngOnInit(): void { }
}
