import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Injectable, OnDestroy } from '@angular/core';
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectGroups } from "src/app/store/group/group.selectors";
import { selectDefaultPreferences } from "src/app/store/project/project.selectors";

@Injectable({
  providedIn: 'root'
})
export class MapEditService implements OnDestroy{

  selectDefaultPreferences$ = new Subscription();
  selectGroups$ = new Subscription();
  selectMapOption$ = new Subscription();
  isEdgeDirectionChecked!: boolean;
  isGroupBoxesChecked!: boolean;
  isMapGridChecked!: boolean;
  isSnapToGridChecked!: boolean;
  isMapOverviewChecked!: boolean;
  gridSpacingSize!: string;
  groupCategoryId!: string;
  groups!: any[];
  interfaces!: any[];
  nodes!: any[];
  defaultPreferences!: any;

  constructor(
    private store: Store,
  ) {
    this.selectGroups$ = this.store.select(selectGroups).subscribe(groups => this.groups = groups);
    this.selectDefaultPreferences$ = this.store.select(selectDefaultPreferences).subscribe(defaultPreferences => this.defaultPreferences = defaultPreferences);
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
    this.selectGroups$.unsubscribe();
    this.selectDefaultPreferences$.unsubscribe();
  }

  removeAllProjectNodesOnMap(cy: any) {
    const projectNodes = cy?.nodes().filter((node: any) => node.data('elem_category') == 'map_link' && !Boolean(node.data('parent_id')))
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
