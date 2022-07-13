import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-map-info-panel',
  templateUrl: './map-info-panel.component.html',
  styleUrls: ['./map-info-panel.component.scss']
})
export class MapInfoPanelComponent implements OnInit, OnDestroy {
  isOpenInfoPanel = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
