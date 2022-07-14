import {Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/helpers.service';

@Component({
    selector: 'app-tool-panel-edit',
    templateUrl: './tool-panel-edit.component.html',
    styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnInit {
    deviceCtr = new FormControl('');
    templateCtr = new FormControl('');
    imageCtr = new FormControl('');
    isCustomizeNode = true;
    isCustomizePG = true;
    filteredDevices: Observable<string[]>;
    filteredTemplates: Observable<string[]>;
    filteredImages: Observable<string[]>;
    devices: string[];
    templates: string[];
    images: string[];

    constructor(private helper: HelpersService) {
        this.devices = ['D1', 'D2', 'D3'];
        this.templates = ['T1', 'T2', 'T3'];
        this.images = ['I1', 'I2', 'I3'];
        this.filteredDevices = this.helper.filter(this.deviceCtr, this.devices)
        this.filteredTemplates = this.helper.filter(this.templateCtr, this.templates)
        this.filteredImages = this.helper.filter(this.imageCtr, this.images)
    }

    ngOnInit(): void {}

    addNode() {
        console.log(this.deviceCtr.value);
        console.log(this.templateCtr.value);
        console.log(this.isCustomizeNode);
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
