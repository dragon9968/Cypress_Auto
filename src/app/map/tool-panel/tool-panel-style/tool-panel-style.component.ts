import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MapPrefService } from 'src/app/map/tool-panel/tool-panel-style/services/map-pref/map-pref.service';
import { retrievedMapPref } from 'src/app/store/map-style/map-style.actions';
import { selectDefaultPreferences } from 'src/app/store/map/map.selectors';

@Component({
  selector: 'app-tool-panel-style',
  templateUrl: './tool-panel-style.component.html',
  styleUrls: ['./tool-panel-style.component.scss']
})
export class ToolPanelStyleComponent implements OnInit, OnDestroy {
  @Input() cy: any;
  @Input() config: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  mapPrefCtr = new FormControl();
  mapPrefs!: any[];
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
  selectDefaultPreferences$ = new Subscription();
  isHideNode = true;
  vAlignSelect?: string;
  hAlignSelect?: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private mapPrefService: MapPrefService,
    private store: Store,
    public helper: HelpersService,
    iconRegistry: MatIconRegistry,
  ) {
    iconRegistry.addSvgIcon('dashed', this.setPath('/assets/icons/dashed.svg'));
    iconRegistry.addSvgIcon('double', this.setPath('/assets/icons/double.svg'));
    this.selectDefaultPreferences$ = this.store.select(selectDefaultPreferences).subscribe(defaultPref => {
      if (defaultPref) {
        this.mapPrefService.get(defaultPref.default_map_pref_id).subscribe(data => {
          this.mapPrefCtr.setValue({
            id: data.result.id,
            name: data.result.name
          });
          this.store.dispatch(retrievedMapPref({ data: data.result }));
        });
      }
    })
  }

  ngDoCheck(): void {
    this.isHideNode = this.activeNodes.length == 0;
    if (this.activeNodes.length == 1) {
      const data = this.activeNodes[0].data();
      this.nodeSize = data.height.replace('px', '');
      this.textSize = typeof data.text_size === 'number' && !isNaN(data.text_size) ? data.text_size : data.text_size.replace('px', '');
      this.textColor = data.text_color;
      this.textBGColor = data.text_bg_color;
      this.textBGOpacity = data.text_bg_opacity;
      this.vAlignSelect = data.text_valign;
      this.hAlignSelect = data.text_halign;
    }
  }

  ngOnInit(): void {
    this.mapPrefService.getAll().subscribe(data => {
      this.mapPrefs = data.result;
    });
  }

  ngOnDestroy(): void {
    this.selectDefaultPreferences$.unsubscribe();
  }

  private setPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  applyMapPref() {
    console.log(this.mapPrefCtr.value);
  }

  selectMapPref($event: MatAutocompleteSelectedEvent) {
    this.mapPrefService.get($event.option.value.id).subscribe(data => {
      this.store.dispatch(retrievedMapPref({ data: data.result }));
    });
  }

  setTextVAlign(value: string) {
    const newTextValign = value;
    const activeEles = this.activeNodes.concat(this.activePGs);
    this.changeTextVAlign({activeEles, newTextValign});
  }

  changeTextVAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_valign = ele.data("text_valign");
      ele.data("text_valign", data.newTextValign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }


  setTextHAlign(value: string) {
    const newTextHalign = value;
    const activeEles = this.activeNodes.concat(this.activePGs);
    this.changeTextHAlign({activeEles, newTextHalign});
  }

  changeTextHAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_halign = ele.data("text_halign");
      ele.data("text_halign", data.newTextHalign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }


  setDirection(value: string) {
    console.log(value);
  }

  setGBType(value: string) {
    console.log(value);
  }

  setNodeSize() {
    const data = this.changeNodeSize({activeNodes: this.activeNodes, nodeSize: this.nodeSize});
    this.activeNodes = data.activeNodes;
  }

  changeNodeSize(data: any) {
    data.nodeSize = data.nodeSize <= 200 ? data.nodeSize : 200;
    const newIconSize = data.nodeSize + "px";
    data.activeNodes.forEach((ele: any) => {
      data.old_icon_size = ele.data("width")
      if (ele.data("elem_category") != "port_group" && ele.data("label") != "map_background") {
        ele.data("width", newIconSize);
        ele.data("height", newIconSize);
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    return data;
  }

  setTextColor(color: string) {
    this._setColorCommon(color, this.changTextColor.bind(this));
  }

  changTextColor(data: any) {
    data.activeEles.forEach((ele : any) => {
      data.old_text_color = ele.data("text_color")
      if (ele.data("label") == "map_background") {
        data.newColor = "#ffffff";
      } else {
        if (!ele.data('label')) {
          const d = ele.data();
          if (!d.new) {
            d.updated = true;
          }
        }
      }
      ele.data("text_color", data.newColor);
    })
    this.textColor = this.helper.fullColorHex(data?.newColor)
    return data
  }

  setTextSize(size: any) {
    const newTextSize = size.value
    const activeEles = this.activeNodes.concat(this.activeEdges, this.activePGs);
    this.changeTextSize({activeEles, newTextSize})
  }

  changeTextSize(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_size = ele.data("text_size");
      ele.data("text_size", data.newTextSize);
      if (!ele.data('label')) {
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    this.textSize = data.newTextSize <= 200 ? data.newTextSize : 200;
    return data;
  }

  changeTextBGOpacity(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_bg_opacity = ele.data("text_bg_opacity");
      ele.data("text_bg_opacity", data.newTextBgOpacity);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    this.textBGOpacity = data.newTextBgOpacity;
    return data;
  }

  setTextBGOpacity(opacity: any) {
    const newTextBgOpacity = opacity.value;
    const activeEles = this.activeNodes.concat(this.activeEdges, this.activePGs);
    this.changeTextBGOpacity({activeEles, newTextBgOpacity})
  }

  setTextBGColor(color: any) {
    this._setColorCommon(color, this.changeTextBGColor.bind(this));
  }

  private _setColorCommon(color: any, changeColorFunc: Function) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const activeEles = this.activeNodes.concat(this.activeEdges, this.activePGs, this.activeGBs);
      changeColorFunc({ activeEles, newColor });
    }
  }

  changeTextBGColor(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_bg_color = ele.data("text_bg_color");
      ele.data("text_bg_color", data.newColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })

    this.textBGColor = this.helper.fullColorHex(data.newColor);
    return data;
  }
}