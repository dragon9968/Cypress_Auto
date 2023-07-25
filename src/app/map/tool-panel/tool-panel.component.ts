import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, Subscription, throwError } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { MapService } from 'src/app/core/services/map/map.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { selectMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.selectors';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { selectMapPref } from 'src/app/store/map-style/map-style.selectors';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';
import { retrievedMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.actions';
import { retrievedMap } from 'src/app/store/map/map.actions';
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { GroupService } from "../../core/services/group/group.service";
import { selectGroups } from "../../store/group/group.selectors";
import { selectNodesByProjectId } from "../../store/node/node.selectors";
import { retrievedGroups } from "../../store/group/group.actions";
import { selectPortGroups } from "../../store/portgroup/portgroup.selectors";
import { ProjectService } from "../../project/services/project.service";
import { selectMapImages } from 'src/app/store/map-image/map-image.selectors';
import { retrievedMapOption } from "../../store/map-option/map-option.actions";
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { loadInterfaces, retrievedInterfaceByProjectIdAndCategory } from 'src/app/store/interface/interface.actions';
import { loadPGs } from 'src/app/store/portgroup/portgroup.actions';
import { loadNodes } from 'src/app/store/node/node.actions';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss']
})
export class ToolPanelComponent implements OnInit, OnDestroy {
  @Input() cy: any;
  @Input() ur: any;
  @Input() config: any;
  @Input() projectId: any;
  @Input() mapCategory: any;
  @Input() isDisableCancel = true;
  @Input() isDisableAddNode = true;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = true;
  @Input() isDisableLinkProject = true;
  @Input() isDisableAddProjectTemplate = true;
  @Input() isDisableNewFromSelected = true;
  @Input() isTemplateCategory = false;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() activeMBs: any[] = [];
  @Input() activeMapLinks: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  @Input() saveMapSubject!: Observable<any>;
  @Input() isAddNode = false;
  @Input() isAddPublicPG = false;
  @Input() isAddPrivatePG = false;
  @Input() isAddMapImage = false;
  @Input() isAddProjectNode = false;
  @Input() isAddProjectTemplate = false;
  updatedNodes: any[] = [];
  updatedInterfaces: any[] = [];
  updatedGroupBoxes: any[] = [];
  updatedMapBackgrounds: any[] = [];
  updatedNodeAndPGInGroups: any[] = [];
  groups: any[] = [];
  nodes: any[] = [];
  portGroups: any[] = [];
  mapImages: any[] = [];
  selectMapOption$ = new Subscription();
  selectMapPref$ = new Subscription();
  selectDefaultPreferences$ = new Subscription();
  selectMapContextMenu$ = new Subscription();
  selectGroups$ = new Subscription();
  selectNodes$ = new Subscription();
  selectMapImages$ = new Subscription();
  saveMap$ = new Subscription();
  selectPortGroup$ = new Subscription();
  isEdgeDirectionChecked!: boolean;
  isGroupBoxesChecked!: boolean;
  isMapGridChecked!: boolean;
  isSnapToGridChecked!: boolean;
  isMapOverviewChecked!: boolean;
  gridSpacingSize!: string;
  groupCategoryId!: string;
  selectedMapPrefId!: string;
  defaultPreferences: any;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private mapService: MapService,
    private dialog: MatDialog,
    private groupService: GroupService,
    private projectService: ProjectService,
    private helpersService: HelpersService,
    private commonService: CommonService,
    private interfaceService: InterfaceService,
  ) {
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
    this.selectMapPref$ = this.store.select(selectMapPref).subscribe((selectedMapPref: any) => {
      this.selectedMapPrefId = selectedMapPref?.id;
    });
    this.selectMapContextMenu$ = this.store.select(selectMapContextMenu).subscribe((mapContextMenu: any) => {
      if (mapContextMenu?.event == 'download') {
        this.download();
        this.store.dispatch(retrievedMapContextMenu({ data: { event: undefined } }));
      } else if (mapContextMenu?.event == 'save') {
        this.save();
        this.store.dispatch(retrievedMapContextMenu({ data: { event: undefined } }));
      } else if (mapContextMenu?.event == 'undo') {
        this.undo();
        this.store.dispatch(retrievedMapContextMenu({ data: { event: undefined } }));
      } else if (mapContextMenu?.event == 'redo') {
        this.redo();
        this.store.dispatch(retrievedMapContextMenu({ data: { event: undefined } }));
      }
    });
    this.selectGroups$ = this.store.select(selectGroups).subscribe(groups => this.groups = groups);
    this.selectNodes$ = this.store.select(selectNodesByProjectId).subscribe(nodes => this.nodes = nodes);
    this.selectPortGroup$ = this.store.select(selectPortGroups).subscribe(portGroups => this.portGroups = portGroups);
    this.selectMapImages$ = this.store.select(selectMapImages).subscribe(mapImage => this.mapImages = mapImage);
  }

  ngOnInit(): void {
    this.saveMap$ = this.saveMapSubject.subscribe(() => this.save());
  }

  ngOnDestroy() {
    this.saveMap$.unsubscribe();
    this.selectNodes$.unsubscribe();
    this.selectGroups$.unsubscribe();
    this.selectMapPref$.unsubscribe();
    this.selectMapOption$.unsubscribe();
    this.selectPortGroup$.unsubscribe();
    this.selectMapContextMenu$.unsubscribe();
    this.selectDefaultPreferences$.unsubscribe();
    this.selectMapImages$.unsubscribe();
  }

  download() {
    const dialogData = {
      title: 'Download Map',
      message: 'PNG file format.',
      submitButtonName: 'Download'
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '600px', data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          const text = this.cy.png({
            output: "blob",
            bg: "#ffffff",
            full: false,
          });
          const file = new Blob([text], { type: "image/png" });
          this.helpersService.downloadBlob("download_map.png", file);
          this.toastr.success('Download map successfully', 'Success')
        } catch (err) {
          this.toastr.error('Download map failed', 'Error')
          throwError(() => err)
        }
      }
    });
  }

  save() {
    this.cy.elements().forEach((ele: any) => {
      const isNotChildrenOfLinkProject = Boolean(ele.parent()?.data('elem_category') != 'map_link');
      if (ele.group() == "nodes" && isNotChildrenOfLinkProject) {
        if (ele.data('elem_category') == 'map_link') {
          this.getUpdateMapLinkNode(ele);
        } else {
          this.getUpdatedNodeOrPGOrGB(ele);
        }
      } else {
        const isEdgeChildrenOfProjectNode = ele.connectedNodes().some((ele: any) => ele.parent()?.data('elem_category') != 'map_link')
        if (isEdgeChildrenOfProjectNode) {
          this.getUpdatedInterface(ele);
        }
      }
    });

    this.getUpdatedNodesInGroup();

    const updatedMapOptions = {
      accessed: true,
      edge_direction_checkbox: this.isEdgeDirectionChecked,
      groupbox_checkbox: this.isGroupBoxesChecked,
      display_map_overview_checkbox: this.isMapOverviewChecked,
      group_category: this.groupCategoryId,
      default_map_pref_id: this.selectedMapPrefId,
      grid_settings: {
        enabled: this.isMapGridChecked,
        spacing: this.gridSpacingSize,
        snap_to_grid: this.isSnapToGridChecked
      }
    }

    const text = this.cy.png({
      output: "blob",
      bg: "#ffffff",
      full: false,
    });
    const file = new Blob([text], { type: "image/png" });
    const formData = new FormData();
    formData.append('file', file, 'map_overview.png');
    this.mapService.uploadMapOverviewImage(formData)
      .pipe(catchError((error: any) => {
          this.toastr.error("Map Overview saved failed");
          return throwError(() => error);
        })
      ).subscribe((resp: any) => {
      this.toastr.success("Map Overview saved");
    });

    const jsonData = {
      updatedNodes: this.updatedNodes,
      updatedInterfaces: this.updatedInterfaces,
      deletedNodes: this.deletedNodes,
      deletedInterfaces: this.deletedInterfaces,
      updatedGroupBoxes: this.updatedGroupBoxes,
      updatedNodeAndPGInGroups: this.updatedNodeAndPGInGroups,
      updatedMapBackgrounds: this.updatedMapBackgrounds,
      updatedMapOptions
    }
    this.mapService.saveMap(this.projectId, this.mapCategory, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error("Map saved failed");
        return throwError(() => error);
      })
    ).subscribe((_respData: any) => {
      if (this.deletedNodes.length > 0) {
        const nodeDeletedIds = this.deletedNodes.map(node => node.elem_category == 'node' && node.id);
        if (nodeDeletedIds.length > 0) {
          this.store.dispatch(loadNodes( {projectId: this.projectService.getProjectId()} ))
        }
        const deletedPGIds = this.deletedNodes.map(pg => pg.elem_category == 'port_group' && pg.id);
        if (deletedPGIds.length > 0) {
          this.store.dispatch(loadPGs( {projectId: this.projectService.getProjectId()} ))
        }
        const deletedNodesLinkProject = this.deletedNodes.filter(node => node.linked_project_id);
        if (deletedNodesLinkProject.length > 0) {
          this.toastr.success('Unlink Project Successfully', 'Success');
          this.projectService.getProjectByStatusAndCategory('active', 'project').subscribe(
            (data: any) => {
              this.helpersService.updateProjectLinksStorage(this.cy, data.result);
            }
          );
        }
      }
      if (this.deletedInterfaces.length > 0) {
        const deletedInterfaceIds = this.deletedInterfaces.map(edge => edge.interface_pk);
        if (deletedInterfaceIds.length > 0) {
          this.store.dispatch(loadInterfaces( {projectId: this.projectService.getProjectId(), mapCategory: this.mapCategory} ))
        }
      }
      this.deletedNodes.splice(0);
      this.deletedInterfaces.splice(0);
      this.cy.elements().forEach((ele: any) => {
        const data = ele.data();
        if (data.updated) {
          data.updated = false;
        }
      });
      if (this.updatedNodeAndPGInGroups.length > 0) {
        this.updateNodesAndPGInGroupStorageAndMap();
      }
      this.store.dispatch(retrievedMapOption({
        data: {
          isEdgeDirectionChecked: this.isEdgeDirectionChecked,
          isGroupBoxesChecked: this.isGroupBoxesChecked,
          isMapGridChecked: this.isMapGridChecked,
          isSnapToGridChecked: this.isSnapToGridChecked,
          isMapOverviewChecked: this.isMapOverviewChecked,
          gridSpacingSize: this.gridSpacingSize,
          groupCategoryId: this.groupCategoryId
        }
      }));
      this.toastr.success("Map saved");
    })
    this.updatedNodes.splice(0);
    this.updatedInterfaces.splice(0);
  }

  refresh() {
    let isDirty = false;
    this.cy.elements().forEach((ele: any) => {
      const data = ele.data();
      if (data.updated) {
        isDirty = true;
      }
    });
    if (isDirty) {
      const dialogData = {
        title: 'User confirmation needed',
        message: 'Are you sure you want to refresh? Changes have not been saved.'
      }
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: true, width: '400px', data: dialogData });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.mapService.getMapData(this.mapCategory, this.projectId).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
          this.activeNodes.splice(0);
          this.activePGs.splice(0);
          this.activeEdges.splice(0);
          this.activeGBs.splice(0);
          this.store.dispatch(retrievedMapSelection({ data: true }));
        }
      });
    }
  }

  undo() {
    this.commonService?.ur.undo();
  }

  redo() {
    this.commonService?.ur.redo();
  }

  cancel() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddNode: false,
        isAddPublicPG: false,
        isAddPrivatePG: false,
        isAddProjectTemplate: false,
        isAddProjectNode: false
      }
    }));
  }

  getUpdatedNodeOrPGOrGB(ele: any) {
    const data = ele.data();
    if (data.label == "group_box") {
      this.getUpdatedGB(ele);
    } else {
      if (data.label == "map_background") {
        this.getUpdatedMapBackground(ele, ele.position());
      } else {
        this.getUpdatedNodeOrPG(ele, ele.position());
      }
    }
  }

  getUpdatedInterface(ele: any) {
    const data = ele.data()
    const updatedInterface = {
      name: data.name,
      source: data.source,
      subnet: data.subnet,
      target: data.target,
      id: data.updated ? data.interface_pk : null,
      label: "edge",
      map_style: {
        direction: data?.direction,
        elem_category: data?.elem_category,
        color: ele.style('line-color'),
        width: ele.style('width'),
        text_size: ele.style("font-size"),
        text_color: ele.style("color"),
        text_bg_color: ele.style("text-background-color"),
        text_bg_opacity: ele.style("text-background-opacity"),
        text_valign: ele.style("text-valign"),
        text_halign: ele.style("text-halign"),
        'line-style': ele.style("line-style"),
        arrow_scale: data?.arrow_scale
      },
    };
    if (data.updated) {
      this.updatedInterfaces.push(updatedInterface);
      data.updated = false;
    }
  }

  getUpdatedGB(ele: any) {
    const data = ele.data();
    const updatedGroupbox: any = {
      group_id: data.group_id,
      collapsed: false,
      label: 'group_box',
      color: ele.style('background-color'),
      group_opacity: ele.style('background-opacity'),
      border_color: ele.style('border-color'),
      border_style: ele.style('border-style'),
      border_width: ele.style('border-width'),
      text_size: ele.style("font-size"),
      text_color: ele.style("color"),
      zIndex: data.zIndex,
      locked: ele.locked()
    };

    if (data.collapsedChildren) {
      updatedGroupbox.collapsed = true;
      const lastPos = data['position-before-collapse'];
      const curPos = ele.position();
      const offset = { x: curPos.x.toFixed(2) - lastPos.x.toFixed(2), y: curPos.y.toFixed(2) - lastPos.y.toFixed(2) };
      const offsetX = offset.x.toFixed(2)
      const offsetY = offset.y.toFixed(2)
      const expandCollapse = this.cy.expandCollapse('get');
      const children = expandCollapse.getCollapsedChildrenRecursively(ele);
      children.forEach((ele: any) => {
        const data = ele.data();
        if (ele.group() == 'nodes') {
          const curPos = ele.position();
          const curPosX = curPos.x.toFixed(2)
          const curPosY = curPos.y.toFixed(2)
          if (data.label == "map_background") {
            this.getUpdatedMapBackground(ele, { x: curPosX + offsetX, y: curPosY + offsetY });
          } else {
            this.getUpdatedNodeOrPG(ele, { x: curPosX + offsetX, y: curPosY + offsetY });
          }
        } else {
          this.getUpdatedInterface(ele);
        }
      }, { 'offset': offset });
    }
    this.updatedGroupBoxes.push(updatedGroupbox);
  }

  getUpdateMapLinkNode(ele: any) {
    const data = ele.data();
    const {collapsedChildren, ...dataParent} = data;
    const updatedNode = {
      id: data.id,
      position: ele.position(),
      elem_category: data.elem_category,
      map_style: {
        height: ele.style("height"),
        width: ele.style("width"),
        text_size: ele.style("font-size"),
        text_color: ele.style("color"),
        text_bg_color: ele.style("text-background-color"),
        text_bg_opacity: ele.style("text-background-opacity"),
        text_valign: ele.style("text-valign"),
        text_halign: ele.style("text-halign"),
        'text-wrap': ele.style("text-wrap"),
        'background-image': ele.style("background-image"),
        'background-fit': ele.style("background-fit"),
        color: ele.data("elem_category") == "port_group" ? ele.style("background-color") : undefined,
        pg_color: ele.data("elem_category") == "port_group" ? data.pg_color : undefined,
      },
      label: data.label,
      data: {
        ...dataParent,
        locked: ele.locked()
      }
    };
    this.updatedNodes.push(updatedNode);
  }


  getUpdatedNodeOrPG(ele: any, position: any) {
    const data = ele.data();
    const updatedNode = {
      id: data.id,
      position,
      elem_category: data.elem_category,
      map_style: {
        height: ele.style("height"),
        width: ele.style("width"),
        text_size: ele.style("font-size"),
        text_color: ele.style("color"),
        text_bg_color: ele.style("text-background-color"),
        text_bg_opacity: ele.style("text-background-opacity"),
        text_valign: ele.style("text-valign"),
        text_halign: ele.style("text-halign"),
        'text-wrap': ele.style("text-wrap"),
        'background-image': ele.style("background-image"),
        'background-fit': ele.style("background-fit"),
        color: ele.data("elem_category") == "port_group" ? ele.style("background-color") : undefined,
        pg_color: ele.data("elem_category") == "port_group" ? data.pg_color : undefined,
      },
      label: data.label,
      data: {
        ...data,
        locked: ele.locked()
      }
    };
    if (data.updated) {
      if (data.id?.includes('node-') || data.id?.includes('pg-')) {
        this.updatedNodes.push(updatedNode);
      }
    }
  }

  getUpdatedMapBackground(ele: any, position: any) {
    const data = ele.data();
    const updatedMapBackground: any = {
      map_image_id: ele.data('map_image_id'),
      position,
      map_style: {
        width: ele.style('width'),
        height: ele.style('height'),
        src: ele.data('src'),
        zIndex: ele.data('zIndex'),
        text_size: ele.style("font-size"),
        text_color: ele.style("color"),
        text_bg_color: ele.style("text-background-color"),
        text_bg_opacity: ele.style("text-background-opacity"),
        text_valign: ele.style("text-valign"),
        text_halign: ele.style("text-halign"),
        label: "map_background",
        elem_category: "bg_image",
        scale_image: ele.data("scale_image"),
        original_width: ele.data("original_width"),
        original_height: ele.data("original_height"),
      },
      locked: ele.locked()
    };
    if (data.in_groupbox) {
      updatedMapBackground.domain = data.domain;
      updatedMapBackground.domain_id = data.domain_id;
      updatedMapBackground.in_groupbox = true;
      updatedMapBackground.elem_category = data.elem_category;
    }
    this.updatedMapBackgrounds.push(updatedMapBackground);
  }

  getUpdatedNodesInGroup() {
    this.groups.map(group => {
      const groupElement = this.cy.getElementById(`group-${group.id}`);
      const nodeIdsInGroup = group.nodes.map((node: any) => node.id);
      const nodeIdsInGroupElement = groupElement.children('[elem_category="node"]').map((node: any) => node.data('node_id'));
      const isNodesInGroupChange = JSON.stringify(nodeIdsInGroup.sort()) !== JSON.stringify(nodeIdsInGroupElement.sort());
      const portGroupIdsInGroup = group.port_groups.map((portGroup: any) => portGroup.id);
      const portGroupIdsInGroupElement = groupElement.children('[elem_category="port_group"]').map((pg: any) => pg.data('pg_id'));
      const isPortGroupsInGroupChange = JSON.stringify(portGroupIdsInGroup.sort()) !== JSON.stringify(portGroupIdsInGroupElement.sort())
      const mapImageIdsInGroup = group.map_images.map((image: any) => image.id);
      const mapImageIdsInGroupElement = groupElement.children('[elem_category="bg_image"]').map((image: any) => image.data('map_image_id'));
      const isMapImageIdsInGroupChange = JSON.stringify(mapImageIdsInGroup.sort()) !== JSON.stringify(mapImageIdsInGroupElement.sort())


      if ((isNodesInGroupChange || isPortGroupsInGroupChange || isMapImageIdsInGroupChange) && this.isGroupBoxesChecked) {
        let item: any = {
          group_id: group.id,
          domain_id: group.domain_id,
          domain: group.domain,
        }
        if (isNodesInGroupChange) {
          if (this.groupCategoryId == 'domain') {
            item.nodes = nodeIdsInGroupElement;
          }
        }
        if (isPortGroupsInGroupChange) {
          if (this.groupCategoryId == 'domain') {
            item.port_groups = portGroupIdsInGroupElement;
          }
        }
        if (isMapImageIdsInGroupChange) {
          if (this.groupCategoryId == 'domain') {
            item.map_images = mapImageIdsInGroupElement;
          }
        }
        this.updatedNodeAndPGInGroups.push(item);
      }
    })
  }

  updateNodesAndPGInGroupStorageAndMap() {
    let newGroups = JSON.parse(JSON.stringify(this.groups));
    let nodeInGB: any[] = [];
    let portGroupsInGB: any[] = [];
    let mapImagesInGB: any[] = [];
    this.cy.nodes().forEach((el: any) => {
      if (el.data('label') == 'group_box') {
        nodeInGB.push(el.children('[elem_category="node"]').map((node: any) => node.data('node_id')))
        portGroupsInGB.push(el.children('[elem_category="port_group"]').map((pg: any) => pg.data('pg_id')))
        mapImagesInGB.push(el.children('[elem_category="bg_image"]').map((image: any) => image.data('map_image_id')))
      }
    })
    this.updatedNodeAndPGInGroups.map(group => {
      const indexGroup = newGroups.findIndex((ele: any) => ele.id === group.group_id);
      let newGroup = newGroups[indexGroup];
      let newNodes: any[] = [];
      let newPortGroups: any[] = [];
      let newMapImages: any[] = [];
      const nodesInGroup = group.nodes;
      const portGroupInGroup = group.port_groups;
      const mapImagesInGroup = group.map_images;
      if (nodesInGroup) {
        if (nodesInGroup.length > 0) {
          nodesInGroup.map((nodeId: any) => {
            // Update domain data for the nodes
            const nodeEle = this.cy.getElementById(`node-${nodeId}`);
            nodeEle.data('domain_id', group.domain_id);
            nodeEle.data('domain', group.domain);
            // Update the list of nodes in the group's storage
            const node = this.nodes.find(node => node.id === nodeId)
            newNodes.push({id: nodeId, name: node.name})
          });
          newGroup.nodes = newNodes;
          this._updateGroupsPropertyOfNodeOnMap(nodesInGroup, newGroup, 'node')
        } else {
          this._removeGroupsPropertyOfNodeOnMap([], newGroup.id, 'node')
          this._updateGroupsElements(nodeInGB, newGroup, newNodes, this.nodes, 'node')
        }
      }
      if (portGroupInGroup) {
        if (portGroupInGroup.length > 0) {
          portGroupInGroup.map((pgId: number) => {
            const pgEle = this.cy.getElementById(`pg-${pgId}`);
            pgEle.data('domain_id', group.domain_id);
            pgEle.data('domain', group.domain);
            const pg = this.portGroups.find(pg => pg.id === pgId);
            newPortGroups.push({id: pgId, name: pg.name});
          })
          newGroup.port_groups = newPortGroups;
          this._updateGroupsPropertyOfNodeOnMap(portGroupInGroup, newGroup, 'pg')
        } else {
          this._removeGroupsPropertyOfNodeOnMap([], newGroup.id, 'pg')
          this._updateGroupsElements(portGroupsInGB, newGroup, newPortGroups, this.portGroups, 'pg')
        }
      }
      if (mapImagesInGroup) {
        if (mapImagesInGroup.length > 0) {
          mapImagesInGroup.map((mapImageId: number) => {
            // const mapImageEle = this.cy.getElementById(`map_image-${mapImageId}`);
            const mapImage = this.mapImages.find(el => el.id === mapImageId);
            newMapImages.push({id: mapImageId, name: mapImage.name});
          })
          newGroup.map_images = newMapImages;
          this._updateGroupsPropertyOfNodeOnMap(mapImagesInGroup, newGroup, 'map_image')
        } else {
          this._removeGroupsPropertyOfNodeOnMap([], newGroup.id, 'map_image')
          this._updateGroupsElements(mapImagesInGB, newGroup, newMapImages, this.mapImages, 'map_image')
        }
      }
      newGroups.splice(indexGroup, 1, newGroup);
    })
    this.updatedNodeAndPGInGroups.splice(0);
    this.store.dispatch(retrievedGroups({ data: newGroups }));
    this.store.dispatch(retrievedMapSelection({ data: true }));
  }

  private _updateGroupsPropertyOfNodeOnMap(itemsIds: any[], group: any, typeOfElement: string) {
    // Add new group into element's groups property
    itemsIds.map((itemId: any) => {
      const element = this.cy.getElementById(`${typeOfElement}-${itemId}`);
      const currentGroups = element.data('groups')
      const isGroupExistInNodeGroup = currentGroups.some((g: any) => g.id === group.id)
      if (!isGroupExistInNodeGroup) {
        const newGroupItem = {
          category: group.category,
          id: group.id,
          name: group.name
        }
        currentGroups.push(newGroupItem)
        element.data('groups', currentGroups)
      }
    });
    this._removeGroupsPropertyOfNodeOnMap(itemsIds, group.id, typeOfElement)
  }

  private _removeGroupsPropertyOfNodeOnMap(itemsIds: any[], groupId: any, typeOfElement: string) {
    // Remove group is not belong to nodes in element's groups property
    const elemCategory = typeOfElement == 'node' ? 'node' : typeOfElement == 'pg' ? 'port_group' : 'bg_image';
    const elementsOnMapBelongToGroup = this.cy.nodes().filter(
      (ele: any) => ele.data('elem_category') == elemCategory && ele.data('groups')
        && ele.data('groups').some((g: any) => g.id === groupId)
    )
    elementsOnMapBelongToGroup.map((ele: any) => {
      if (!itemsIds.includes(ele.data(`${typeOfElement}_id`))) {
        const groups = ele.data('groups')
        const groupIndex = groups.findIndex((g: any) => g.id === groupId)
        groups.splice(groupIndex, 1)
        ele.data('groups', groups)
      }
    })
  }

  private _updateGroupsElements(itemInGB: any[], newGroup: any, newItems: any[], data: any[], typeOfElement: any) {
    let itemInOldGroup = typeOfElement === 'node' ? newGroup.nodes : typeOfElement === 'pg' ? newGroup.port_groups : newGroup.map_images;
    if (itemInGB.length > 0) {
      itemInGB.forEach(value => {
        if (value.length > 0) {
          const isExistsItemId = itemInOldGroup.some((item: any) => value.includes(item.id));
          if (isExistsItemId) {
            itemInOldGroup = itemInOldGroup.filter((item: any) => !value.includes(item.id));
            const itemInOldGroupId = itemInOldGroup.map((item: any) => item.id)
            if (itemInOldGroupId.length > 0) {
              itemInOldGroupId.map((val: any) => {
                const element = data.find(el => el.id === val)
                newItems.push({id: val, name: element.name})
              })
              this._assignElementWithType(newGroup, typeOfElement, newItems)
            } else {
              this._assignElementWithType(newGroup, typeOfElement, [])
            }
          }
        } else {
          this._assignElementWithType(newGroup, typeOfElement, [])
        }
      })
    } else {
      this._assignElementWithType(newGroup, typeOfElement, [])
    }
  }

  private _assignElementWithType(newGroup: any, typeOfElement: any, result: any[]) {
    if (typeOfElement === 'node') {
      newGroup.nodes = result;
    } else if (typeOfElement === 'pg') {
      newGroup.port_groups = result;
    } else if (typeOfElement === 'map_image') {
      newGroup.map_images = result;
    }
  }

}
