import {Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { Option } from 'src/app/shared/models/option.model';

@Component({
    selector: 'app-tool-panel-edit',
    templateUrl: './tool-panel-edit.component.html',
    styleUrls: ['./tool-panel-edit.component.scss']
})
export class ToolPanelEditComponent implements OnInit {
    deviceCtr = new FormControl();
    templateCtr = new FormControl();
    imageCtr = new FormControl();
    isCustomizeNode = true;
    isCustomizePG = true;
    filteredDevices: Observable<Option[]>;
    filteredTemplates: Observable<Option[]>;
    filteredImages: Observable<Option[]>;
    devices: Option[];
    templates: Option[];
    images: Option[];

    constructor(private helper: HelpersService) {
        this.devices = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.templates = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.images = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.filteredDevices = this.helper.filter(this.deviceCtr, this.devices)
        this.filteredTemplates = this.helper.filter(this.templateCtr, this.templates)
        this.filteredImages = this.helper.filter(this.imageCtr, this.images)
    }

    ngOnInit(): void {}

    optionDisplay(option: Option) {
        return option && option.name ? option.name : '';
    }

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
