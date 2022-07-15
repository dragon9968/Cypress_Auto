import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { generateCyStyle } from './constants/cy-style.constant';
import { MapDataModel } from './models/map-data.model';
import { MapService } from './service/map.service';
import { retrievedMapData } from './store/map.actions';
import { selectMap } from './store/map.selectors';
import { environment } from 'src/environments/environment';
import * as cytoscape from 'cytoscape';
var navigator = require('cytoscape-navigator');



@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
    cy: any;
    isOpenToolPanel = false;
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
    selectMapData$ = new Subscription()

    constructor(private mapService: MapService,
        private route: ActivatedRoute,
        private store: Store
    ) {
        navigator(cytoscape);
        this.selectMapData$ = this.store.select(selectMap)
            .subscribe((map: MapDataModel) => {
                if (Object.keys(map).length > 0) {
                    this.mapCategory = map.mapCategory;
                    this.collectionId = map.collectionId;
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
            this.mapService.getMapData(params['category'], params['collection_id'])
                .subscribe((data: any) => this.store.dispatch(retrievedMapData({
                    mapCategory: params['category'],
                    collectionId: params['collection_id'],
                    data
                })));
        });
    }

    ngOnDestroy(): void {
        this.selectMapData$.unsubscribe();
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
            gb_exists: this.groupBoxes.length > 0 ? true : false,
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
            style: generateCyStyle(this.config.default_preferences),
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
