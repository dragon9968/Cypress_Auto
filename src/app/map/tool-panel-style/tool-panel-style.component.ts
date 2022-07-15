import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import {MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Option } from 'src/app/shared/models/option.model';

@Component({
    selector: 'app-tool-panel-style',
    templateUrl: './tool-panel-style.component.html',
    styleUrls: ['./tool-panel-style.component.scss']
})
export class ToolPanelStyleComponent {
    mapPrefCtr = new FormControl();
    filteredMapPref: Observable<Option[]>;
    mapPrefs: Option[];
    nodeSize = 70;
    edgeColor = '#000000';
    edgeSize = 2;
    arrowSize = 3;
    pgColor = '#0000FF';
    pgSize = 20;
    gbColor = '#00DCFF';
    gbOpacity = 0.0;
    gbBorderColor = '#CCCCCC';
    textSize = 25;
    textColor = '#000000';
    textBGColor = '#000000';
    textBGOpacity = 0.0;

    constructor(
        private helper: HelpersService,
        iconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer
    ) {
        iconRegistry.addSvgIcon('dashed', this.setPath('/assets/icons/dashed.svg'));
        iconRegistry.addSvgIcon('double', this.setPath('/assets/icons/double.svg'));
        this.mapPrefs = [
            { value: "v1", name: "Name 1" },
            { value: "v2", name: "Name 2" },
            { value: "v3", name: "Name 3" },
        ];
        this.filteredMapPref = this.helper.filter(this.mapPrefCtr, this.mapPrefs)
    }

    private setPath(url: string): SafeResourceUrl { 
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url); 
    }

    optionDisplay(option: Option) {
        return option && option.name ? option.name : '';
    }

    applyMapPref() {
        console.log(this.mapPrefCtr.value);
    }

    setTextVAlign(value: string) {
        console.log(value);
    }

    setTextHAlign(value: string) {
        console.log(value);
    }

    setDirection(value: string) {
        console.log(value);
    }

    setGBType(value: string) {
        console.log(value);
    }
}
