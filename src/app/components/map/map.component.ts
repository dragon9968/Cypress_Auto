import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMap } from 'src/app/components/map/store/map.selectors';
import { retrievedMapData } from 'src/app/components/map/store/map.action';
import { MapService } from './services/map.service';
import { HelpersService } from 'src/app/shared/services/helpers.service';
import { Subscription } from 'rxjs';
import * as cytoscape from 'cytoscape';
import { MapDataModel } from './models/map-data.model';
import { environment } from 'src/environments/environment';
import { generateCyStyle } from './constants/cy-style.constant';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  cy: cytoscape.Core | undefined;
  map_category = 'logical';
  map_id = 1;
  map_items: any;
  map_properties: any;
  gb_dict: any;
  domains: any;
  config: any;
  defaults: any;
  styleExists: any;
  cleared: any;
  eles: any[] = [];
  selectMapData$ = new Subscription()

  constructor(
    private mapService: MapService,
    private store: Store,
    private helpers: HelpersService
  ) {
    this.selectMapData$ = this.store.select(selectMap)
    .subscribe((mapData: MapDataModel) => {
      if (Object.keys(mapData).length > 0) {
        this.initCytoscape(mapData);
      }
    });
  }

  ngOnInit(): void {
    this.mapService.getMapData(this.map_category, this.map_id)
    .subscribe((mapData: MapDataModel) => this.store.dispatch(retrievedMapData({ mapData })));
  }

  ngOnDestroy(): void {
    this.selectMapData$.unsubscribe();
  }

  init_config(): void {
    this.config = {
      default_preferences: this.map_properties.default_preferences,
      gb_exists : this.gb_dict.length > 0 ? true : false,
      live_packets : false,
      default_domain_id : this.map_properties.default_domain_id,
      styleExists : this.map_properties.default_preferences.accessed,
      cleared : this.map_properties.default_preferences.cleared,
      grid_settings : this.map_properties.default_preferences.grid_settings ? this.map_properties.default_preferences.grid_settings : null
    }
    const extra_defaults = {
        default_icon_path: "/assets/img/icons/default_icon.png",
        default_img_path: "/assets/img/uploads/",
        public_portgroup_url: '/api/v1/portgroup/gen_data/public',
        private_portgroup_url: '/api/v1/portgroup/gen_data/private',
        node_view_url: '/ap1/v1/node/gen_data',
        enc_node_view_url: '/nodeview/gen_enc_data/',
        save_url: '/api/v1/map/save_data/' + this.map_category,
        enclave_save_url: "/enclaveview/save_map/" + this.map_id,
        enc_to_proj: "/enclaveview/enclave_to_project/",
        enc_to_enc: "/enclaveview/enclave_to_enclave/",
        infra_to_proj: "/infraview/infra_to_project/"
    }
    this.config.default_preferences = {
      ...this.config.default_preferences,
      ...extra_defaults
    }
    const extra_configs = {
        nodes_size_max: 200,
        text_size_max: 200,
        edge_size_max: 50,
        port_group_max: 200,
        grid_spacing_max: 200,
        display_map_overview: true,
        display_map_grid: false,
        grid_space_default: "100",
        display_status: true,
        range_map_refresh_time: 30000,
        search_color: "rgb(255,255,50)",
        debug_output: false,
        grid_on_options: {
          snapToGridOnRelease: true,
          snapToGridDuringDrag: false,
          snapToAlignmentLocationOnRelease: false,
          snapToAlignmentLocationDuringDrag: false,
          distributionGuidelines: false,
          geometricGuideline: false,
          initPosAlignment: false,
          centerToEdgeAlignment: false,
          resize: false,
          parentPadding: false,
          drawGrid: true,
          gridSpacing: "100",
          snapToGridCenter: false,
          zoomDash: true,
          panGrid: true,
          gridStackOrder: 0,
          gridColor: '#c7c7c7',
          lineWidth: 1.0,

          guidelinesTolerance: 2.00,
          guidelinesStyle: {
            strokeStyle: "#8b7d6b",
            geometricGuidelineRange: 400,
            range: 100,
            minDistRange: 10,
            distGuidelineOffset: 10,
            horizontalDistColor: "#ff0000",
            verticalDistColor: "#00ff00",
            initPosAlignmentColor: "#0000ff",
            lineDash: [0, 0],
            horizontalDistLine: [0, 0],
            verticalDistLine: [0, 0],
            nitPosAlignmentLine: [0, 0],
            parentSpacing: -1
          }
        },
        grid_off_options: {
          drawGrid: false,
          snapToGridOnRelease: false,
          snapToGridDuringDrag: false,
        },
        nav_defaults: {
          container: false,
          viewLiveFramerate: 0,
          thumbnailEventFramerate: 30,
          thumbnailLiveFramerate: false, 
          dblClickDelay: 200,
          removeCustomContainer: true,
          rerenderDelay: 100,
          zIndex: -999,
        },
        tool_panel: {
            zIndex: -999,
            isRange: true
        },
        info_panel: {
        },
        cdnd_enable_options: {
          grabbedNode: (_node: any) => true,
          dropTarget: (_node: any) => true,
          dropSibling: (_node: any) => true,
          newParentNode: (_grabbedNode: any, _dropSibling: any) => ({}),
          overThreshold: 10,
          outThreshold: 10
        }
    }
    this.config = {
      ...this.config,
      ...extra_configs
    }
  }

  initCytoscape(mapData: MapDataModel): void {
    this.map_items = mapData.map_items;
    this.map_properties = mapData.map_properties;
    this.gb_dict = this.map_items.group_boxes;
    this.domains = this.map_properties.domains;
    this.init_config();
    this.defaults = this.config.default_preferences;
    this.styleExists = this.map_properties.styleExists;
    this.cleared = this.map_properties.cleared;
    this.eles = JSON.parse(JSON.stringify(this.map_items['nodes']
    .concat(this.map_items.interfaces)
    .concat(this.map_items.map_backgrounds)));
    this.eles.forEach(ele => {
      ele.locked = ele.data.locked
      if (ele.data.elem_category == 'node') {
        ele.data.icon = environment.apiBaseUrl + ele.data.icon;
      }
    });
    this.cy = cytoscape({
      container: document.getElementById("cy"),
      elements: this.eles,
      style: generateCyStyle(this.defaults),
      layout: (this.styleExists || this.cleared) ? { name: 'preset' } : {
        name: "cose",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 5,
        fit: true,
        animate: false,
      },
      // mouse wheel zoom speed
      wheelSensitivity: .2,
    });
  }
}
