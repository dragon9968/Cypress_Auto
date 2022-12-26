import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MapPrefService } from 'src/app/core/services/map-pref/map-pref.service';
import { retrievedMapPref } from 'src/app/store/map-style/map-style.actions';
import { selectDefaultPreferences } from 'src/app/store/map/map.selectors';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';
import { ToastrService } from 'ngx-toastr';
import { CMGroupBoxService } from '../../context-menu/cm-groupbox/cm-groupbox.service';
import { CMLockUnlockService } from '../../context-menu/cm-lock-unlock/cm-lock-unlock.service';
import { selectMapSelection } from 'src/app/store/map-selection/map-selection.selectors';
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';

@Component({
  selector: 'app-tool-panel-style',
  templateUrl: './tool-panel-style.component.html',
  styleUrls: ['./tool-panel-style.component.scss']
})
export class ToolPanelStyleComponent implements OnInit, OnDestroy {
  @Input() cy: any;
  @Input() ur: any;
  @Input() config: any;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() activeMBs: any[] = [];
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
  gbOpacityLabel = 0;
  gbBorderColor = '#CCCCCC';
  textSize = 25;
  textColor = '#000000';
  textBGColor = '#000000';
  textBGOpacity = 0.0;
  textBGOpacityLabel = 0;
  selectDefaultPreferences$ = new Subscription();
  selectMapPref$ = new Subscription();
  isHideNode: boolean = true;
  isHidePGs: boolean = true;
  isHideText: boolean = true;
  isHideEdge: boolean = true;
  isHideGBs: boolean = true;
  isHideMBs: boolean = true;
  vAlignSelect?: string;
  hAlignSelect?: string;
  arrowActivated?: string;
  gbBorderTypeActivated?: string;
  selectedMapPref: any;
  positionForm!: FormGroup;
  selectMapSelection$ = new Subscription();

  constructor(
    private domSanitizer: DomSanitizer,
    private mapPrefService: MapPrefService,
    private store: Store,
    public helpers: HelpersService,
    private commonService: CommonService,
    iconRegistry: MatIconRegistry,
    private toastr: ToastrService,
    private cmGroupBoxService: CMGroupBoxService,
    private cmLockUnlockService: CMLockUnlockService,
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
    });
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((selectedMapPref: any) => {
      this.selectedMapPref = selectedMapPref;
    });
    this.selectMapSelection$ = this.store.select(selectMapSelection).subscribe(mapSelection => {
      if (mapSelection) {
        this.isHideNode = this.activeNodes.length == 0;
        this.isHideEdge = this.activeEdges.length == 0;
        this.isHidePGs = this.activePGs.length == 0;
        this.isHideGBs = this.activeGBs.length == 0;
        this.isHideMBs = this.activeMBs.length == 0;
        this.isHideText = this.activeNodes.length + this.activePGs.length + this.activeEdges.length + this.activeGBs.length == 0;
        if (this.activeNodes.length >= 1) {
          const data = this.activeNodes[0].data();
          this.nodeSize = this.removePx(data.height);
          const ele = this.cy.getElementById(data.id);
          this.xCtr?.setValue(ele.position().x.toFixed(2));
          this.yCtr?.setValue(ele.position().y.toFixed(2));
          this._setPropertiesCommon(data);
        }
        if (this.activePGs.length >= 1) {
          const data = this.activePGs[0].data();
          this.pgColor = data.color;
          this.pgSize = this.removePx(data.height);
          const ele = this.cy.getElementById(data.id);
          this.xCtr?.setValue(ele.position().x.toFixed(2));
          this.yCtr?.setValue(ele.position().y.toFixed(2));
          this._setPropertiesCommon(data);
        }
        if (this.activeEdges.length >= 1) {
          const data = this.activeEdges[0].data();
          this.edgeColor = data.color;
          this.edgeSize = this.removePx(data.width);
          this.arrowActivated = data.direction;
          this.arrowSize = data.arrow_scale ? this.removePx(data.arrow_scale) : 1;
          this._setPropertiesCommon(data);
        }
        if (this.activeGBs.length >= 1) {
          const data = this.activeGBs[0].data();
          this.gbColor = data.color;
          this.gbOpacity = data.group_opacity;
          this.gbOpacityLabel = this.gbOpacity ? Math.round(this.gbOpacity * 100) : 0;
          this.gbBorderColor = data.border_color;
          this.gbBorderTypeActivated = data.border_style;
          this.textColor = data.text_color;
        }
        if (this.activeMBs.length >= 1) {
          const data = this.activeMBs[0].data();
          const ele = this.cy.getElementById(data.id);
          this.xCtr?.setValue(ele.position().x.toFixed(2));
          this.yCtr?.setValue(ele.position().y.toFixed(2));
          this._setPropertiesCommon(data);
        }
        this.store.dispatch(retrievedMapSelection({ data: false }));
      }
    });
    this.positionForm = new FormGroup({
      xCtr: new FormControl('', []),
      yCtr: new FormControl('', []),
    });
  }

  get xCtr() { return this.positionForm.get('xCtr'); }
  get yCtr() { return this.positionForm.get('yCtr'); }

  private _setPropertiesCommon(data: any) {
    this.textColor = data.text_color;
    this.textSize = this.removePx(data.text_size);
    this.textBGColor = data.text_bg_color ? data.text_bg_color : data.logical_map_style?.text_bg_color;
    this.textBGOpacity = data.text_bg_opacity != undefined ? data.text_bg_opacity : data.logical_map_style?.text_bg_opacity;
    this.textBGOpacityLabel = this.textBGOpacity ? Math.round(this.textBGOpacity * 100) : 0;
    this.vAlignSelect = data.text_valign ? data.text_valign : data.logical_map_style?.text_valign;
    this.hAlignSelect = data.text_halign ? data.text_halign : data.logical_map_style?.text_halign;
  }

  removePx(value: any) {
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
    const activeEles = this.activeNodes.concat(this.activePGs, this.activeEdges, this.activeGBs);
    const newTextColor = this.selectedMapPref.text_color;
    const newTextSize = this.selectedMapPref.text_size + 'px';
    const newTextBGColor = this.selectedMapPref.text_bg_color;
    const newTextBGOpacity = this.selectedMapPref.text_bg_opacity;
    const newTextHAlign = this.selectedMapPref.text_halign;
    const newTextVAlign = this.selectedMapPref.text_valign;
    const newNodeSize = this.selectedMapPref.node_size + 'px';
    const newPGSize = this.selectedMapPref.port_group_size + 'px';
    const newEdgeSize = this.selectedMapPref.edge_width + 'px';
    const newDirection = this.selectedMapPref.edge_arrow_direction;
    const newArrowScale = this.selectedMapPref.edge_arrow_size + 'px';
    const newPGColor = this.selectedMapPref.port_group_color;
    const newEdgeColor = this.selectedMapPref.edge_color;
    const newGBColor = this.selectedMapPref.group_box_color;
    const newGBOpacity = this.selectedMapPref.group_box_opacity;
    const newGBBorderType = this.selectedMapPref.group_box_border;
    const newGBBorderColor = this.selectedMapPref.group_box_border_color;
    this.ur.do("changTextColor", { activeEles, newTextColor });
    this.ur.do("changeTextSize", { activeEles, newTextSize });
    this.ur.do("changeTextBGColor", { activeEles, newTextBGColor });
    this.ur.do("changeTextBGOpacity", { activeEles, newTextBGOpacity });
    this.ur.do("changeTextHAlign", { activeEles, newTextHAlign });
    this.ur.do("changeTextVAlign", { activeEles, newTextVAlign });
    this.ur.do("changeNodeSize", { activeNodes: this.activeNodes, newNodeSize });
    this.ur.do("changePGSize", { activePGs: this.activePGs, newPGSize });
    this.ur.do("changeEdgeSize", { activeEdges: this.activeEdges, newEdgeSize });
    this.ur.do("changeDirection", { activeEdges: this.activeEdges, newDirection });
    this.ur.do("changeArrowScale", { activeEdges: this.activeEdges, newArrowScale });
    this.ur.do("changePGColor", { activePGs: this.activePGs, newPGColor });
    this.ur.do("changeEdgeColor", { activeEdges: this.activeEdges, newEdgeColor });
    this.ur.do("changeGBColor", { activeGBs: this.activeGBs, newGBColor });
    this.ur.do("changeGBOpacity", { activeGBs: this.activeGBs, newGBOpacity });
    this.ur.do("changeGBType", { activeGBs: this.activeGBs, newGBBorderType });
    this.ur.do("changeGBBorderColor", { activeGBs: this.activeGBs, newGBBorderColor });
    this.store.dispatch(retrievedMapSelection({ data: true }));
  }

  selectMapPref($event: MatAutocompleteSelectedEvent) {
    this.mapPrefService.get($event.option.value.id).subscribe(data => {
      this.store.dispatch(retrievedMapPref({ data: data.result }));
    });
  }

  setTextVAlign(value: string) {
    this.vAlignSelect = value;
    this.commonService.textVAlign(
      value, this.activeNodes, this.activePGs
    )
  }

  setTextHAlign(value: string) {
    this.hAlignSelect = value;
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
    this.gbBorderTypeActivated = newGbBorderType
    this.commonService.gBType(
      newGbBorderType,
      this.activeGBs
    );
  }

  setNodeSize(size: any) {
    this.nodeSize = size.value <= 100 ? size.value : 100;
    this.commonService.changeNodeSize(
      size,
      this.activeNodes
    );
  }

  setTextColor(color: string) {
    this.textColor = this.helpers.fullColorHex(color);
    this.commonService.textColor(
      color,
      this.activeNodes,
      this.activePGs,
      this.activeEdges,
      this.activeGBs
    );
  }

  setTextSize(size: any) {
    this.textSize = size.value <= 200 ? size.value : 200;
    this.commonService.textSize(
      size,
      this.activeNodes,
      this.activeEdges,
      this.activePGs
    );
  }

  setTextBGOpacity(opacity: any) {
    this.textBGOpacity = opacity.value;
    this.textBGOpacityLabel = Math.round(this.textBGOpacity * 100);
    this.commonService.textBGOpacity(
      opacity,
      this.activeNodes,
      this.activeEdges,
      this.activePGs
    );
  }

  setTextBGColor(color: any) {
    this.textBGColor = this.helpers.fullColorHex(color);
    this.commonService.textBGColor(
      color,
      this.activeNodes,
      this.activeEdges,
      this.activePGs,
      this.activeGBs
    );
  }

  setPGColor(color: string) {
    this.pgColor = this.helpers.fullColorHex(color);
    this.commonService.pgColor(
      color,
      this.activePGs
    );
  }


  setPGSize(size: any) {
    this.pgSize = size.value <= 200 ? size.value : 200;
    this.commonService.pgSize(
      size,
      this.activePGs
    );
  }

  setEdgeColor(color: string) {
    this.edgeColor = this.helpers.fullColorHex(color);
    this.commonService.edgeColor(
      color,
      this.activeEdges
    );
  }

  setEdgeSize(size: any) {
    this.edgeSize = size.value <= 50 ? size.value : 50;
    this.commonService.edgeSize(
      size,
      this.activeEdges,
    );
  }

  setArrowScale(size: any) {
    this.arrowSize = size.value <= 200 ? size.value : 200;
    this.commonService.arrowScale(
      size,
      this.activeEdges
    );
  }

  setGBColor(newGbColor: string) {
    this.gbColor = this.helpers.fullColorHex(newGbColor);
    this.commonService.gBColor(
      newGbColor, this.activeGBs
    );
  }

  setGBOpacity(event: any) {
    this.gbOpacity = event.value;
    this.gbOpacityLabel = Math.round(event.value * 100);
    this.commonService.gbOpacity(event, this.activeGBs);
  }

  setGBBorderColor(newGbBorderColor: string) {
    this.gbBorderColor = this.helpers.fullColorHex(newGbBorderColor);
    this.commonService.gBBorderColor(
      newGbBorderColor,
      this.activeGBs
    );
  }

  increaseZIndex() {
    this.activeNodes.concat(this.activePGs, this.activeEdges, this.activeGBs, this.activeMBs).map(ele => {
      this.cmGroupBoxService.moveUp(ele);
    });
  }

  decreaseZIndex() {
    this.activeNodes.concat(this.activePGs, this.activeEdges, this.activeGBs, this.activeMBs).map(ele => {
      ele._private['data'] = { ...ele._private['data'] };
      const label = ele.data('label');
      if (label == 'map_background') {
        if (this.config.gb_exists) {
          const g = ele.parent();
          if (g.data('zIndex') == -998) {
            this.toastr.warning('group box zIndex out of bounds');
            return;
          }
          g.data('zIndex', g.data('zIndex') - 1);
        }
      } else {
        if (ele.data('zIndex') == -998) {
          this.toastr.warning('group box zIndex out of bounds');
          return;
        }
      }
      ele.data('zIndex', ele.data('zIndex') - 1);
    });
  }

  lockNodes() {
    this.cmLockUnlockService.lockNodes(this.cy, this.activeNodes, this.activePGs, this.activeMBs);
  }

  unlockNodes() {
    this.cmLockUnlockService.unlockNodes(this.activeNodes, this.activePGs, this.activeMBs);
  }

  updatePosition() {
    let data: any;
    if (this.activeNodes.length >= 1) {
      data = this.activeNodes[0].data();
    } else if (this.activePGs.length >= 1) {
      data = this.activePGs[0].data();
    } else if (this.activeMBs.length >= 1) {
      data = this.activeMBs[0].data();
    }
    const ele = this.cy.getElementById(data.id);
    ele.position('x', +this.xCtr?.value);
    ele.position('y', +this.yCtr?.value);
    ele.data('updated', true);
  }
}
