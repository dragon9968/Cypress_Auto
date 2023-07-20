import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Injectable, OnDestroy } from '@angular/core';
import { HelpersService } from "../helpers/helpers.service";
import { retrievedMap } from "../../../store/map/map.actions";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { selectDefaultPreferences } from "../../../store/map/map.selectors";
import { selectGroups } from "src/app/store/group/group.selectors";

@Injectable({
  providedIn: 'root'
})
export class MapEditService implements OnDestroy{

  selectMapProperties$ = new Subscription();
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
    private helpersService: HelpersService
  ) {
    this.selectGroups$ = this.store.select(selectGroups).subscribe(groups => this.groups = groups);
    this.selectMapProperties$ = this.store.select(selectDefaultPreferences).subscribe(defaultPreferences => this.defaultPreferences = defaultPreferences);
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
    this.selectMapProperties$.unsubscribe();
  }

  convertNodeElementOnMapToDataFormat(nodeEle: any) {
    return { data: nodeEle.data(), layout: { name: 'present'}, position: nodeEle.position() }
  }

  convertEdgeElementOnMapToDataFormat(edgeEle: any) {
    return { data: edgeEle.data()}
  }

  isNodeNotInProjectNode(nodeElem: any) {
    return nodeElem.data('elem_category') != 'map_link' && !(nodeElem.data('parent') && nodeElem.data('parent').includes('project-link'))
  }

  updateGroupBoxesInMapStorage(cy: any, groupBoxes: any[]) {
    let nodesInProjectNodes: any = []
    let edgesInProjectNodes: any = []
    const nodesEleNotInProjectNode = cy.nodes().filter(this.isNodeNotInProjectNode)
    let nodesOnMap = nodesEleNotInProjectNode.map(this.convertNodeElementOnMapToDataFormat)
    const nodeIdsInProjectNode = nodesOnMap.filter((ele: any) => ele.data.node_id).map((e: any) => e.data.node_id)
    const pgIdsInProjectNode = nodesOnMap.filter((ele: any) => ele.data.pg_id).map((e: any) => e.data.pg_id)
    const edgesEleNotInProjectNode = cy.edges((edge: any) =>
      !(edge.data('node_id') in nodeIdsInProjectNode || edge.data('pg_id') in pgIdsInProjectNode)
    )
    let edgesOnMap = edgesEleNotInProjectNode.map(this.convertEdgeElementOnMapToDataFormat);
    cy.nodes('[elem_category="map_link"]').map((ele: any) => {
      const children = ele.data('collapsedChildren') || ele.children()
      if (children && children.length > 0) {
        nodesInProjectNodes = children.nodes().map(this.convertNodeElementOnMapToDataFormat);
        nodesOnMap = nodesOnMap.concat(nodesInProjectNodes);
        edgesInProjectNodes = children.edges().map(this.convertEdgeElementOnMapToDataFormat);
        edgesOnMap = edgesOnMap.concat(edgesInProjectNodes);
        // Remove collapsedChildren
        const projectNodeData = ele.data();
        delete projectNodeData.collapsedChildren;
        nodesOnMap.push({ data: projectNodeData, layout: { name: 'present'}, position: ele.position() })
      }
    })

    const defaultPreferences = JSON.parse(JSON.stringify(this.defaultPreferences))
    defaultPreferences.edge_direction_checkbox = this.isEdgeDirectionChecked
    defaultPreferences.groupbox_checkbox = this.isGroupBoxesChecked
    defaultPreferences.grid_settings = {
      enabled: this.isMapGridChecked,
      spacing: this.gridSpacingSize,
      snap_to_grid: this.isSnapToGridChecked
    }
    defaultPreferences.group_category = this.groupCategoryId
    const newMapData = {
      defaultPreferences: defaultPreferences
    }
    this.store.dispatch(retrievedMap({data: newMapData}))
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
