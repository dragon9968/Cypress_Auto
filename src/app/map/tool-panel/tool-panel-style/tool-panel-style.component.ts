import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
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
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';

@Component({
  selector: 'app-tool-panel-style',
  templateUrl: './tool-panel-style.component.html',
  styleUrls: ['./tool-panel-style.component.scss']
})
export class ToolPanelStyleComponent implements OnInit, OnDestroy, DoCheck {
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
  isHideNode: boolean = true;
  isHidePGs: boolean = true;
  isHideText: boolean = true;
  isHideEdge: boolean = true;
  isHideGBs: boolean = true;
  vAlignSelect?: string;
  hAlignSelect?: string;
  arrowActivated?: string;
  gbBorderTypeActivated?: string;

  constructor(
    private domSanitizer: DomSanitizer,
    private mapPrefService: MapPrefService,
    private store: Store,
    public helpers: HelpersService,
    private commonService: CommonService,
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
    this.isHideEdge = this.activeEdges.length == 0;
    this.isHidePGs = this.activePGs.length == 0;
    this.isHideGBs = this.activeGBs.length == 0;
    this.isHideText = this.activeNodes.length + this.activePGs.length + this.activeEdges.length + this.activeGBs.length == 0;
    if (this.activeNodes.length >= 1) {
      const data = this.activeNodes[0].data();
      this.nodeSize = data.height.replace('px', '');
      this.textSize = this.removePx(data.text_size);
      this._setPropertiesCommon(data);
    }
    if (this.activePGs.length >= 1) {
      const data = this.activePGs[0].data();
      this.pgColor = data.color;
      this.pgSize = this.removePx(data.height);
      this._setPropertiesCommon(data);
    }
    if (this.activeEdges.length >= 1) {
      const data = this.activeEdges[0].data();
      this.textSize = this.removePx(data.text_size);
      this.edgeColor = data.color;
      this.edgeSize = this.removePx(data.width);
      this.arrowActivated = data.direction;
      this.arrowSize = data.arrow_scale ? this.removePx(data.arrow_scale): 1;
      this._setPropertiesCommon(data);
    }
    if (this.activeGBs.length >= 1) {
      const data = this.activeGBs[0].data();
      this.gbColor = data.color;
      this.gbOpacity = data.group_opacity;
      this.gbBorderColor = data.border_color;
      this.gbBorderTypeActivated = data.border_style;
      this.textColor = data.text_color;
    }
  }

  private _setPropertiesCommon(data: any) {
    this.textColor = data.text_color;
    this.textBGColor = data.text_bg_color;
    this.textBGOpacity = data.text_bg_opacity;
    this.vAlignSelect = data.text_valign;
    this.hAlignSelect = data.text_halign;
  }

  removePx(value: any){
    return value ? (typeof value === 'number' && !isNaN(value) ? value : value.replace('px', '')) : value;
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
    this.commonService.textVAlign(
      value, this.activeNodes, this.activePGs
    )
  }

  setTextHAlign(value: string) {
    this.commonService.textHAlign(
      value, this.activeNodes, this.activePGs
    );
  }

  setDirection(value: string) {
    this.commonService.edgeDirection(
      value,
      this.activeEdges,
    );
  }

  setGBType(newGbBorderType: string) {
    this.commonService.gBType(
      newGbBorderType,
      this.activeGBs,
      this.gbBorderTypeActivated
    );
  }

  setNodeSize() {
    this.commonService.changeNode(
      this.activeNodes,
      this.nodeSize
    );
  }

  setTextColor(color: string) {
    this.commonService.textColor(
      color, 
      this.activeNodes, 
      this.activePGs, 
      this.activeEdges, 
      this.activeGBs,
      this.textColor
    );
  }

  setTextSize(size: any) {
    this.commonService.textSize(
      size,
      this.textSize,
      this.activeNodes,
      this.activeEdges,
      this.activePGs
    );
  }

  setTextBGOpacity(opacity: any) {
    this.commonService.textBGOpacity(
      opacity, 
      this.activeNodes,
      this.activeEdges, 
      this.activePGs,
      this.textBGOpacity
    );
  }

  setTextBGColor(color: any) {
    this.commonService.textBGColor(
      color,
      this.activeNodes,
      this.activeEdges,
      this.activePGs,
      this.activeGBs,
      this.textBGColor
    );
  }

  setPGColor(color: string) {
    this.commonService.pgColor(
      color,
      this.activePGs,
      this.pgColor
    );
  }


  setPGSize(size: any) {
    this.commonService.pgSize (
      size,
      this.activePGs,
      this.pgSize
    );
  }

  setEdgeColor(color: string) {
    this.commonService.edgeColor(
      color,
      this.activeEdges,
      this.edgeColor
    );
  }

  setEdgeSize(size: any) {
    this.commonService.edgeSize(
      size,
      this.activeEdges,
      this.edgeSize
    );
  }

  setArrowScale(size: any) {
    this.commonService.arrowScale (
      size, 
      this.activeEdges,
      this.arrowSize
    );
  }

  setGBColor(newGbColor: string) {
    this.commonService.gBColor(
      newGbColor, this.activeGBs, this.gbColor
    );
  }

  setGBOpacity(event: any) {
    this.commonService.gbOpacity(event, this.activeGBs, this.gbOpacity);
  }

  setGBBorderColor(newGbBorderColor: string) {
    // this.changeGBBorderColor({activeGbs: this.activeGBs, newGbBorderColor});
    this.commonService.gBBorderColor(
      newGbBorderColor,
      this.activeGBs, 
      this.gbBorderColor
      );
  }
}
