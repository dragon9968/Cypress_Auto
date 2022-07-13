import {Component, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
    selector: 'app-map-tool-panel',
    templateUrl: './map-tool-panel.component.html',
    styleUrls: ['./map-tool-panel.component.scss']
})
export class MapToolPanelComponent implements OnInit {
    deviceControl = new FormControl('');
    templateControl = new FormControl('');
    imageControl = new FormControl('');
    customizeNodeControl = new FormControl(true);
    customizePGControl = new FormControl(true);
    filteredDevices: Observable<string[]>;
    filteredTemplates: Observable<string[]>;
    filteredImages: Observable<string[]>;
    devices: string[];
    templates: string[];
    images: string[];
    
    constructor() {
        this.devices = ['D1', 'D2', 'D3'];
        this.templates = ['T1', 'T2', 'T3'];
        this.images = ['I1', 'I2', 'I3'];
        this.filteredDevices = this._filter(this.deviceControl, this.devices)
        this.filteredTemplates = this._filter(this.templateControl, this.templates)
        this.filteredImages = this._filter(this.imageControl, this.images)
    }

    ngOnInit(): void {}

    private _filter(control: FormControl<string | null>, options: string[]) {
        return control.valueChanges.pipe(
            startWith(''),
            map(value => {
                const filterValue = value ? value.toLowerCase() : '';
                return options.filter(option => option.toLowerCase().includes(filterValue));
            }),
        );
    }

    addNode() {
        console.log(this.deviceControl.value);
        console.log(this.templateControl.value);
        console.log(this.customizeNodeControl.value);
    }

    addPublicPG() {
        console.log(this.customizePGControl.value);
    }

    addPrivatePG() {
        console.log(this.customizePGControl.value);
    }

    addImage() {
        console.log(this.imageControl.value);
    }
}
