import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  isOpenToolPanel = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
