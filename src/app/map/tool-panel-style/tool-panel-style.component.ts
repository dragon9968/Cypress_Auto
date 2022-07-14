import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import {MatIconRegistry} from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-tool-panel-style',
    templateUrl: './tool-panel-style.component.html',
    styleUrls: ['./tool-panel-style.component.scss']
})
export class ToolPanelStyleComponent implements OnInit {
    mapPrefCtr = new FormControl('');
    filteredMapPref: Observable<string[]>;
    mapPrefs: string[];
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
        this.mapPrefs = ['DMP1', 'DMP2', 'DMP'];
        this.filteredMapPref = this.helper.filter(this.mapPrefCtr, this.mapPrefs)
    }

    ngOnInit(): void {}

    private setPath(url: string): SafeResourceUrl { 
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url); 
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
