import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MapModel } from '../shared/models/map.model';
import { retrievedMap } from '../shared/store/map/map.actions';
import { environment } from 'src/environments/environment';
import * as cytoscape from 'cytoscape';
import { MapService } from '../shared/services/map/map.service';
import { HelpersService } from '../shared/services/helper/helpers.service';
import { selectMapFeature } from '../shared/store/map/map.selectors';
import { retrievedIcons } from '../shared/store/icon/icon.actions';
import { retrievedDevices } from '../shared/store/device/device.actions';
import { retrievedTemplates } from '../shared/store/template/template.actions';
import { retrievedHardwares } from '../shared/store/hardware/hardware.actions';
import { retrievedDomains } from '../shared/store/domain/domain.actions';
import { retrievedConfigTemplates } from '../shared/store/config-template/config-template.actions';
import { retrievedLoginProfiles } from '../shared/store/login-profile/login-profile.actions';
import { IconService } from '../shared/services/icon/icon.service';
import { DeviceService } from '../shared/services/device/device.service';
import { TemplateService } from '../shared/services/template/template.service';
import { HardwareService } from '../shared/services/hardware/hardware.service';
import { DomainService } from '../shared/services/domain/domain.service';
import { ConfigTemplateService } from '../shared/services/config-template/config-template.service';
import { LoginProfileService } from '../shared/services/login-profile/login-profile.service';
var navigator = require('cytoscape-navigator');


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  cy: any;
  isOpenToolPanel = true;
  mapCategory = '';
  collectionId = 0;
  nodes: any;
  interfaces: any;
  groupBoxes: any;
  mapBackgrounds: any;
  mapProperties: any;
  defaultPreferences: any;
  config: any;
  styleExists: any;
  cleared: any;
  eles: any[] = [];
  selectMap$ = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private helpers: HelpersService,
    private mapService: MapService,
    private iconService: IconService,
    private deviceService: DeviceService,
    private templateService: TemplateService,
    private hardwareService: HardwareService,
    private domainService: DomainService,
    private configTemplateService: ConfigTemplateService,
    private loginProfileService: LoginProfileService,
  ) {
    navigator(cytoscape);
    this.selectMap$ = this.store.select(selectMapFeature).subscribe((map: MapModel) => {
      if (Object.keys(map).length > 0) {
        this.nodes = map.nodes;
        this.interfaces = map.interfaces;
        this.groupBoxes = map.groupBoxes;
        this.nodes = map.nodes;
        this.mapBackgrounds = map.mapBackgrounds;
        this.mapProperties = map.mapProperties;
        this.defaultPreferences = map.defaultPreferences;
        this.initCytoscape();
      }
    });
    
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.mapCategory = params['category'];
      this.collectionId = params['collection_id'];
      this.mapService.getMapData(params['category'], params['collection_id']).subscribe((data: any) => this.store.dispatch(retrievedMap({ data })));
    });
    this.iconService.getIcons().subscribe((data: any) => this.store.dispatch(retrievedIcons({ data })));
    this.deviceService.getDevices().subscribe((data: any) => this.store.dispatch(retrievedDevices({ data })));
    this.templateService.getTemplates().subscribe((data: any) => this.store.dispatch(retrievedTemplates({ data })));
    this.hardwareService.getHardwares().subscribe((data: any) => this.store.dispatch(retrievedHardwares({ data })));
    this.domainService.getDomains().subscribe((data: any) => this.store.dispatch(retrievedDomains({ data })));
    this.configTemplateService.getConfigTemplates().subscribe((data: any) => this.store.dispatch(retrievedConfigTemplates({ data })));
    this.loginProfileService.getLoginProfiles().subscribe((data: any) => this.store.dispatch(retrievedLoginProfiles({ data })));
    this.deviceService.getDevices().subscribe((data: any) => this.store.dispatch(retrievedDevices({ data })));
    this.templateService.getTemplates().subscribe((data: any) => this.store.dispatch(retrievedTemplates({ data })));
  }

  ngOnDestroy(): void {
    this.selectMap$.unsubscribe();
  }

  initCytoscape(): void {
    this.config = {
      default_preferences: {
        ...this.defaultPreferences,
        default_icon_path: "/assets/icons/default_icon.png",
        default_img_path: "/static/img/uploads/",
        public_portgroup_url: '/api/v1/portgroup/gen_data/public',
        private_portgroup_url: '/api/v1/portgroup/gen_data/private',
        node_view_url: '/ap1/v1/node/gen_data',
        enc_node_view_url: '/nodeview/gen_enc_data/',
        save_url: '/api/v1/map/save_data/' + this.mapCategory,
        enclave_save_url: "/enclaveview/save_map/" + this.collectionId,
        enc_to_proj: "/enclaveview/enclave_to_project/",
        enc_to_enc: "/enclaveview/enclave_to_enclave/",
        infra_to_proj: "/infraview/infra_to_project/"
      },
      gb_exists: this.groupBoxes?.length > 0 ? true : false,
      live_packets: false,
      default_domain_id: this.mapProperties.default_domain_id,
      styleExists: this.defaultPreferences.accessed,
      cleared: this.defaultPreferences.cleared,
      grid_settings: this.defaultPreferences.grid_settings ? this.defaultPreferences.grid_settings : null,
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
    this.styleExists = this.mapProperties.styleExists;
    this.cleared = this.mapProperties.cleared;
    this.eles = JSON.parse(JSON.stringify(this.nodes
      .concat(this.interfaces)
      .concat(this.mapBackgrounds)));
    this.eles.forEach(ele => {
      ele.locked = ele.data.locked
      if (ele.data.elem_category == 'node') {
        ele.data.icon = environment.apiBaseUrl + ele.data.icon;
      }
    });
    this.cy = cytoscape({
      container: document.getElementById("cy"),
      elements: this.eles,
      style: this.helpers.generateCyStyle(this.config.default_preferences),
      layout: (this.styleExists || this.cleared) ? { name: 'preset' } : {
        name: "cose",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 5,
        fit: true,
        animate: false,
      },
      wheelSensitivity: 0.2,
    });
  }
}
