import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Injectable } from '@angular/core';
import { HelpersService } from "../helpers/helpers.service";
import { retrievedMap } from "../../../store/map/map.actions";
import { selectNodesByProjectId } from "../../../store/node/node.selectors";
import { selectGroupBoxes, selectInterfaces, selectMapProperties } from "../../../store/map/map.selectors";

@Injectable({
  providedIn: 'root'
})
export class MapEditService {

  selectMapProperties$ = new Subscription();
  selectInterfaces$ = new Subscription();
  selectGroupBoxes$ = new Subscription();
  selectNodes$ = new Subscription();
  groupBoxes!: any[];
  interfaces!: any[];
  nodes!: any[];
  mapProperties!: any;
  constructor(
    private store: Store,
    private helpersService: HelpersService
  ) {
    this.selectGroupBoxes$ = this.store.select(selectGroupBoxes).subscribe(groupBoxes => this.groupBoxes = groupBoxes);
    this.selectMapProperties$ = this.store.select(selectMapProperties).subscribe(mapProperties => this.mapProperties = mapProperties);
    this.selectNodes$ = this.store.select(selectNodesByProjectId).subscribe(nodes => this.nodes = nodes);
    this.selectInterfaces$ = this.store.select(selectInterfaces).subscribe(interfaces => this.interfaces = interfaces);
  }

  updateGroupBoxesInMapStorage(cy: any, groupBoxes: any[]) {
    const newMapData = {
      map_items: {
        nodes: this.nodes,
        interfaces: this.interfaces,
        group_boxes: this.groupBoxes.concat(groupBoxes)
      },
      map_properties: this.mapProperties
    }
    this.store.dispatch(retrievedMap({data: newMapData}))
    this.helpersService.reloadGroupBoxes(cy)
  }
}
