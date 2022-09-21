import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { catchError, Subscription, throwError } from 'rxjs';
import { MapService } from 'src/app/core/services/map/map.service';
import { retrievedMapEdit } from 'src/app/store/map-edit/map-edit.actions';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { selectMapStyle } from 'src/app/store/map-style/map-style.selectors';

@Component({
  selector: 'app-tool-panel',
  templateUrl: './tool-panel.component.html',
  styleUrls: ['./tool-panel.component.scss']
})
export class ToolPanelComponent implements OnInit, OnDestroy {
  @Input() cy: any;
  @Input() config: any;
  @Input() collectionId: any;
  @Input() mapCategory: any;
  @Input() isDisableCancel = true;
  @Input() isDisableAddNode = false;
  @Input() isDisableAddPG = false;
  @Input() isDisableAddImage = false;
  @Input() activeNodes: any[] = [];
  @Input() activePGs: any[] = [];
  @Input() activeEdges: any[] = [];
  @Input() activeGBs: any[] = [];
  @Input() deletedNodes: any[] = [];
  @Input() deletedInterfaces: any[] = [];
  updatedNodes: any[] = [];
  updatedInterfaces: any[] = [];
  updatedGroupBoxes: any[] = [];
  updatedMapBackgrounds: any[] = [];
  selectMapOption$ = new Subscription();
  selectMapStyle$ = new Subscription();
  selectDefaultPreferences$ = new Subscription();
  isEdgeDirectionChecked!: boolean;
  isGroupBoxesChecked!: boolean;
  isMapGridChecked!: boolean;
  isSnapToGridChecked!: boolean;
  isMapOverviewChecked!: boolean;
  gridSpacingSize!: string;
  groupCategoryId!: string;
  selectedDefaultPrefId!: string;
  defaultPreferences: any;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private mapService: MapService,
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
    this.selectMapStyle$ = this.store.select(selectMapStyle).subscribe((selectedDefaultPref: any) => {
      this.selectedDefaultPrefId = selectedDefaultPref?.id;
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.selectMapOption$.unsubscribe();
    this.selectMapStyle$.unsubscribe();
  }

  downloadMap() {
    console.log('downloadMap');
  }

  saveMap() {
    this.cy.elements().forEach((ele: any) => {
      if (ele.group() == "nodes") {
        this.getUpdatedNodeOrPGOrGB(ele);
      } else {
        this.getUpdatedInterface(ele);
      }
    });

    const updatedMapOptions = {
      accessed: true,
      edge_direction_checkbox: this.isEdgeDirectionChecked,
      groupbox_checkbox: this.isGroupBoxesChecked,
      display_map_overview_checkbox: this.isMapOverviewChecked,
      group_category: this.groupCategoryId,
      default_map_pref_id: this.selectedDefaultPrefId,
      grid_settings: {
        enabled: this.isMapGridChecked,
        spacing: this.gridSpacingSize,
        snap_to_grid: this.isSnapToGridChecked
      }
    }
    const jsonData = {
      updatedNodes: this.updatedNodes,
      updatedInterfaces: this.updatedInterfaces,
      deletedNodes: this.deletedNodes,
      deletedInterfaces: this.deletedInterfaces,
      updatedGroupBoxes: this.updatedGroupBoxes,
      updatedMapOptions
    }
    this.mapService.saveMap(this.collectionId, this.mapCategory, jsonData).pipe(
      catchError((error: any) => {
        this.toastr.error("Map saved failed");
        return throwError(() => error);
      })
    ).subscribe((_respData: any) => {
      this.deletedNodes.splice(0);
      this.deletedInterfaces.splice(0);
      this.cy.elements().forEach((ele: any) => {
        const data = ele.data();
        if (data.updated) {
          data.updated = false;
        }
      });
      this.toastr.success("Map saved");
    })
    this.updatedNodes.splice(0);
    this.updatedInterfaces.splice(0);
  }

  refreshMap() {
    console.log('refreshMap');
  }

  undoMap() {
    console.log('undoMap');
  }

  redoMap() {
    console.log('redoMap');
  }

  cancelEditMap() {
    this.store.dispatch(retrievedMapEdit({
      data: {
        isAddNode: false,
        isAddPublicPG: false,
        isAddPrivatePG: false,
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
      id: data.updated ? data.interface_id : null,
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
      text_size: ele.style("font-size"),
      text_color: ele.style("color"),
      zIndex: data.zIndex,
      locked: ele.locked()
    };

    if (data.collapsedChildren) {
      updatedGroupbox.collapsed = true;
      const lastPos = data['position-before-collapse'];
      const curPos = ele.position();
      const offset = { x: curPos.x - lastPos.x, y: curPos.y - lastPos.y };
      const offsetX = offset.x
      const offsetY = offset.y
      const expandCollapse = this.cy.expandCollapse('get');
      const children = expandCollapse.getCollapsedChildrenRecursively(ele);
      children.forEach((ele: any) => {
        const data = ele.data();
        if (ele.group() == 'nodes') {
          const curPos = ele.position();
          const curPosX = curPos.x
          const curPosY = curPos.y
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
      this.updatedNodes.push(updatedNode);
    }
  }

  getUpdatedMapBackground(ele: any, position: any) {
    const data = ele.data();
    const updatedMapBackground: any = {
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
        locked: ele.locked()
      }
    };
    if (data.in_groupbox) {
      updatedMapBackground.domain = data.domain;
      updatedMapBackground.domain_id = data.domain_id;
      updatedMapBackground.in_groupbox = true;
      updatedMapBackground.elem_category = data.elem_category;
    }
    this.updatedMapBackgrounds.push(updatedMapBackground);
  }
}
