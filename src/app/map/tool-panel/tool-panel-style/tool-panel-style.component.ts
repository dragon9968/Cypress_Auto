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

  ngOnInit(): void {
    this.mapPrefService.getAll().subscribe(data => {
      this.mapPrefs = data.result;
    });
  }

  ngOnChanges(valueChange: any) {
    if (valueChange.config.currentValue) {
      const d = this.config.default_preferences;
      this.nodeSize = d.node.width.replace('px', '');
      this.textSize = d.text.size.replace('px', '');
      this.textColor = d.text.color;
      this.edgeSize = d.edge.size.replace('px', '');
      this.edgeColor = d.edge.color;
      this.pgSize = d.port_group.size.replace('px', '');
      this.pgColor = d.port_group.color;
      this.gbColor = d.group_box.color;
      this.gbOpacity = d.group_box.group_opacity;
    }
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
