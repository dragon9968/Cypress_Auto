import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent implements OnInit, OnDestroy {
  isOpenInfoPanel = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
