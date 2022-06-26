import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMap } from 'src/app/components/map/store/map.selectors';
import { retrievedMapData } from 'src/app/components/map/store/map.action';
import { MapService } from './services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  map_items: any;
  map_properties: any;
  
  selectMapData$ = this.store.select(selectMap)
  .subscribe(mapData => {
    this.map_items = mapData.map_items
    this.map_properties = mapData.map_properties
  });

  constructor(private mapService: MapService, private store: Store) {}

  ngOnInit(): void {
    this.mapService.getMapData('logical')
    .subscribe((mapData) => this.store.dispatch(retrievedMapData({ mapData })));
  }

  ngOnDestroy(): void {
    this.selectMapData$.unsubscribe();
  }
}
