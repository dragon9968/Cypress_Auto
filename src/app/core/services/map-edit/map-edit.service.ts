import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Injectable, OnDestroy } from '@angular/core';
import { HelpersService } from "../helpers/helpers.service";
import { retrievedMap } from "../../../store/map/map.actions";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectGroupBoxes, selectMapProperties } from "../../../store/map/map.selectors";

@Injectable({
  providedIn: 'root'
})
export class MapEditService implements OnDestroy{

  selectMapProperties$ = new Subscription();
  selectGroupBoxes$ = new Subscription();
  selectMapOption$ = new Subscription();
  isEdgeDirectionChecked!: boolean;
  isGroupBoxesChecked!: boolean;
  isMapGridChecked!: boolean;
  isSnapToGridChecked!: boolean;
  isMapOverviewChecked!: boolean;
  gridSpacingSize!: string;
  groupCategoryId!: string;
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
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isEdgeDirectionChecked = mapOption.isEdgeDirectionChecked;
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.isMapGridChecked = mapOption.isMapGridChecked;
        this.isSnapToGridChecked = mapOption.isSnapToGridChecked;
        this.isMapOverviewChecked = mapOption.isMapOverviewChecked;
        this.gridSpacingSize = mapOption.gridSpacingSize;
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectGroupBoxes$.unsubscribe();
    this.selectMapProperties$.unsubscribe();
  }

  updateGroupBoxesInMapStorage(cy: any, groupBoxes: any[]) {
    const nodesOnMap = cy.nodes().map((ele: any) => ({ data: ele.data(), layout: { name: 'present'}, position: ele.position() }))
    const edgesOnMap = cy.edges().map((ele: any) => ({ data: ele.data()}));
    const newMapProperties = JSON.parse(JSON.stringify(this.mapProperties))
    newMapProperties.default_preferences.map_style.edge_direction_checkbox = this.isEdgeDirectionChecked
    newMapProperties.default_preferences.map_style.groupbox_checkbox = this.isGroupBoxesChecked
    newMapProperties.default_preferences.map_style.grid_settings = {
      enabled: this.isMapGridChecked,
      spacing: this.gridSpacingSize,
      snap_to_grid: this.isSnapToGridChecked
    }
    newMapProperties.default_preferences.map_style.group_category = this.groupCategoryId
    const newMapData = {
      map_items: {
        nodes: JSON.parse(JSON.stringify(nodesOnMap)),
        interfaces: JSON.parse(JSON.stringify(edgesOnMap)),
        group_boxes: JSON.parse(JSON.stringify(this.groupBoxes.concat(groupBoxes))),
      },
      map_properties: newMapProperties
    }
    this.store.dispatch(retrievedMap({data: newMapData}))
  }

  removeAllProjectNodesOnMap(cy: any) {
    const projectNodes = cy.nodes().filter((node: any) => node.data('elem_category') == 'map_link' && !Boolean(node.data('parent_id')))
    if (projectNodes && projectNodes.length > 0) {
      projectNodes.map((projectNode: any) => {
        const data = projectNode.data();
        if (data.collapsedChildren) {
          cy.expandCollapse('get').expandRecursively(projectNode, {});
        }
        const childrenNodes = projectNode.children();
        childrenNodes.forEach((node: any) => {
          cy.remove(node);
        });
        cy.remove(projectNode);
      })
    }
  }
}
