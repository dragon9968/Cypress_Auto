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
import { loadMap } from 'src/app/store/map/map.actions';
import { selectGroups } from "../../store/group/group.selectors";
import { selectDeletedPortGroups, selectMapPortGroups } from "../../store/portgroup/portgroup.selectors";
import { selectDeletedMapImages, selectMapImages } from 'src/app/store/map-image/map-image.selectors';
import { retrievedMapOption } from "../../store/map-option/map-option.actions";
import { selectDeletedLogicalNodes, selectLogicalNodes } from 'src/app/store/node/node.selectors';
import { selectDeletedLogicalInterfaces } from 'src/app/store/interface/interface.selectors';
import { selectDeletedMapLinks } from "../../store/map-link/map-link.selectors";
import { loadProjectsNotLinkYet } from "../../store/project/project.actions";
import { loadGroups } from "../../store/group/group.actions";
import { updateNode } from "../../store/node/node.actions";
import { updatePG } from "../../store/portgroup/portgroup.actions";

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
  @Input() saveMapSubject!: Observable<any>;
  @Input() isAddNode = false;
  @Input() isAddPublicPG = false;
  @Input() isAddPrivatePG = false;
  @Input() isAddMapImage = false;
  @Input() isAddProjectNode = false;
  @Input() isAddProjectTemplate = false;
  deletedLogicalNodes: any[] = [];
  deletedPortGroups: any[] = [];
  deletedLogicalInterfaces: any[] = [];
  deletedMapLinks: any[] = [];
  deletedMapImages: any[] = [];
  updatedNodes: any[] = [];
  updatedPGs: any[] = [];
  updatedInterfaces: any[] = [];
  updatedMapLinks: any[] = [];
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
  selectMapPortGroups$ = new Subscription();
  selectDeletedLogicalNodes$ = new Subscription();
  selectDeletedPortGroups$ = new Subscription();
  selectDeletedLogicalInterfaces$ = new Subscription();
  selectDeletedMapLinks$ = new Subscription();
  selectDeletedMapImages$ = new Subscription();
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
    private helpersService: HelpersService,
    private commonService: CommonService,
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
    this.selectNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => this.nodes = nodes);
    this.selectDeletedLogicalNodes$ = this.store.select(selectDeletedLogicalNodes).subscribe(deletedLogicalNodes => {
      if (deletedLogicalNodes) {
        this.deletedLogicalNodes = deletedLogicalNodes;
      }
    });
    this.selectDeletedPortGroups$ = this.store.select(selectDeletedPortGroups).subscribe(deletedPortGroups => {
      if (deletedPortGroups) {
        this.deletedPortGroups = deletedPortGroups;
      }
    });
    this.selectDeletedLogicalInterfaces$ = this.store.select(selectDeletedLogicalInterfaces).subscribe(deletedLogicalInterfaces => {
      if (deletedLogicalInterfaces) {
        this.deletedLogicalInterfaces = deletedLogicalInterfaces;
      }
    });
    this.selectDeletedMapLinks$ = this.store.select(selectDeletedMapLinks).subscribe(deletedMapLinks => {
      if (deletedMapLinks) {
        this.deletedMapLinks = deletedMapLinks;
      }
    });
    this.selectDeletedMapImages$ = this.store.select(selectDeletedMapImages).subscribe(deletedMapImages => {
      if (deletedMapImages) {
        this.deletedMapImages = deletedMapImages;
      }
    });
    this.selectMapPortGroups$ = this.store.select(selectMapPortGroups).subscribe(portGroups => this.portGroups = portGroups);
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
    this.selectMapPortGroups$.unsubscribe();
    this.selectMapContextMenu$.unsubscribe();
    this.selectDefaultPreferences$.unsubscribe();
    this.selectMapImages$.unsubscribe();
    this.selectDeletedLogicalNodes$.unsubscribe();
    this.selectDeletedLogicalInterfaces$.unsubscribe();
    this.selectDeletedMapLinks$.unsubscribe();
    this.selectDeletedMapImages$.unsubscribe();
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

  isNotChildrenOfMapLink(ele: any) {
    return Boolean(ele.parent()?.data('elem_category') != 'map_link');
  }

  save() {
    this.cy.elements().forEach((ele: any) => {
      if (ele.group() == "nodes" && this.isNotChildrenOfMapLink(ele)) {
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
      deletedNodes: this.deletedLogicalNodes,
      deletedPGs: this.deletedPortGroups,
      deletedInterfaces: this.deletedLogicalInterfaces,
      deletedMapLinks: this.deletedMapLinks,
      deletedMapImages: this.deletedMapImages,
      updatedNodes: this.updatedNodes,
      updatedPGs: this.updatedPGs,
      updatedInterfaces: this.updatedInterfaces,
      updatedMapLinks: this.updatedMapLinks,
      updatedMapBackgrounds: this.updatedMapBackgrounds,
      updatedGroupBoxes: this.updatedGroupBoxes,
      updatedNodeAndPGInGroups: this.updatedNodeAndPGInGroups,
      updatedMapOptions
    }
    this.mapService.saveMap(this.projectId, this.mapCategory, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error("Map saved failed");
        return throwError(() => error);
      })
    ).subscribe((_) => {
      this.cy.elements().forEach((ele: any) => {
        const data = ele.data();
        if (data.updated) {
          data.updated = false;
        }
      });
      if (this.deletedMapLinks.length > 0) {
        this.store.dispatch(loadProjectsNotLinkYet({ projectId: this.projectId }));
      }
      if (this.updatedNodeAndPGInGroups.length > 0) {
        this.updateDomainInNodesAndPGs(this.updatedNodeAndPGInGroups)
        this.store.dispatch(loadGroups({ projectId: this.projectId }));
      }
      this.deletedLogicalNodes.splice(0);
      this.deletedPortGroups.splice(0);
      this.deletedLogicalInterfaces.splice(0);
      this.deletedMapLinks.splice(0);
      this.deletedMapImages.splice(0);
      this.updatedNodes.splice(0);
      this.updatedPGs.splice(0);
      this.updatedInterfaces.splice(0);
      this.updatedMapLinks.splice(0);
      this.updatedMapBackgrounds.splice(0);
      this.updatedGroupBoxes.splice(0);
      this.updatedNodeAndPGInGroups.splice(0);
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
          this.store.dispatch(loadMap({ projectId: this.projectId, mapCategory: this.mapCategory }));
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
        text_outline_color: ele.style("text-outline-color"),
        text_outline_width: ele.style("text-outline-width"),
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
      text_outline_color: ele.style("text-outline-color"),
      text_outline_width: ele.style("text-outline-width"),
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
    const { collapsedChildren, ...dataParent } = data;
    const updatedNode = {
      id: data.id,
      position: ele.position(),
      elem_category: data.elem_category,
      map_style: {
        height: ele.style("height"),
        width: ele.style("width"),
        text_size: ele.style("font-size"),
        text_color: ele.style("color"),
        text_outline_color: ele.style("text-outline-color"),
        text_outline_width: ele.style("text-outline-width"),
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
    this.updatedMapLinks.push(updatedNode);
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
        text_outline_color: ele.style("text-outline-color"),
        text_outline_width: ele.style("text-outline-width"),
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
      if (data.elem_category == 'node' || data.id?.includes('pg-')) {
        this.updatedNodes.push(updatedNode);
      } else if (data.elem_category == 'port_group') {
        this.updatedPGs.push(updatedNode);
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
        text_outline_color: ele.style("text-outline-color"),
        text_outline_width: ele.style("text-outline-width"),
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

      if (this.isGroupBoxesChecked && (isNodesInGroupChange || isPortGroupsInGroupChange || isMapImageIdsInGroupChange)) {
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

  updateDomainInNodesAndPGs(updatedNodeAndPGInGroups: any[]) {
    updatedNodeAndPGInGroups.map(group => {
        const nodesInGroup = group.nodes;
        const portGroupInGroup = group.port_groups;
        if (nodesInGroup && nodesInGroup.length > 0) {
          nodesInGroup.map((nodeId: any) => {
            this.store.dispatch(updateNode({
              id: nodeId,
              data: { domain_id: group.domain_id }
            }));
          });
        }
        if (portGroupInGroup && portGroupInGroup.length > 0) {
          portGroupInGroup.map((pgId: number) => {
            this.store.dispatch(updatePG({
              id: pgId,
              data: { domain_id: group.domain_id }
            }));
          })
        }
      }
    )
  }
}
