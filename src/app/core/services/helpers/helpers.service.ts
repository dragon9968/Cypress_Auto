import { Store } from '@ngrx/store';
import { map, startWith, Subscription, throwError } from 'rxjs';
import { Injectable, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { FormControl, FormGroup } from '@angular/forms';
import { validateIP } from 'src/app/shared/validations/ip-subnet.validation.ag-grid';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';
import { selectLinkedMapNodes, selectLogicalNodes, } from "../../../store/node/node.selectors";
import { removeNodes, restoreNodes } from "../../../store/node/node.actions";
import { RemoteCategories } from "../../enums/remote-categories.enum";
import {
  retrievedIsConfiguratorConnect,
  retrievedIsHypervisorConnect,
  retrievedIsDatasourceConnect
} from "../../../store/server-connect/server-connect.actions";
import { ServerConnectService } from "../server-connect/server-connect.service";
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { AddUpdateGroupDialogComponent } from "../../../map/add-update-group-dialog/add-update-group-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CONFIG_TEMPLATE_ADDS_TYPE } from "../../../shared/contants/config-template-add-actions.constant";
import { selectGroups } from 'src/app/store/group/group.selectors';
import { isIPv4 } from 'is-ip';
import { selectNetmasks } from 'src/app/store/netmask/netmask.selectors';
import { selectLinkedMapPortGroups, selectMapPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { clearNotification } from 'src/app/store/app/app.actions';
import { IpReservationModel, RangeModel } from '../../models/config-template.model';
import { selectNotification } from 'src/app/store/app/app.selectors';
import { selectMapLinks } from "../../../store/map-link/map-link.selectors";
import {
  selectInterfacesCommonMapLinks,
  selectLinkedMapInterfaces, selectLogicalMapInterfaces
} from "../../../store/interface/interface.selectors";
import { selectLinkedMapImages, selectMapImages } from "../../../store/map-image/map-image.selectors";
import { clearLinkedMap } from "../../../store/map/map.actions";
import { removePGs, restorePGs } from 'src/app/store/portgroup/portgroup.actions';
import { removeInterfaces, restoreInterfaces } from 'src/app/store/interface/interface.actions';
import { retrievedMapContextMenu } from "../../../store/map-context-menu/map-context-menu.actions";
import { ProjectService } from "../../../project/services/project.service";
import { GroupService } from "../group/group.service";
import { validateProject } from "../../../store/project/project.actions";

@Injectable({
  providedIn: 'root'
})
export class HelpersService implements OnDestroy {
  @Input() cy: any;
  @Input() ur: any;
  selectMapOption$ = new Subscription();
  selectGroups$ = new Subscription();
  selectNodes$ = new Subscription();
  selectNetmasks$ = new Subscription();
  selectMapPortGroups$ = new Subscription();
  selectNotification$ = new Subscription();
  selectMapLinks$ = new Subscription();
  selectLinkedMapNodes$ = new Subscription();
  selectLinkedMapPGs$ = new Subscription();
  selectLinkedMapInterfaces$ = new Subscription();
  selectLinkedMapImages$ = new Subscription();
  selectInterfacesCommonMapLinks$ = new Subscription();
  selectLogicalMapInterfaces$ = new Subscription();
  selectMapImages$ = new Subscription();
  nodes: any[] = [];
  portGroups: any[] = [];
  interfacesLogical: any[] = [];
  linkedMapNodes: any;
  linkedMapPGs: any;
  linkedMapInterfaces: any;
  linkedMapImages: any;
  interfacesCommonMapLinks!: any[];
  mapImages!: any[];
  groupCategoryId!: string;
  errorMessages = ErrorMessages;
  isGroupBoxesChecked!: boolean;
  isEdgeDirectionChecked!: boolean;
  netmasks: any[] = [];
  groups: any[] = [];
  histories: any[] = [];
  mapLinks: any[] = [];
  lastWidth = 0;
  lastHeight = 0;
  zoomLimit = false;
  configTemplateAddsType = CONFIG_TEMPLATE_ADDS_TYPE;
  isValidOSPFBgpMetric: boolean = true;
  isValidOSPFConnectedMetric: boolean = true;
  isValidOSPFStaticMetric: boolean = true;
  isValidOSPFBgpState: boolean = true;
  isValidOSPFConnectedState: boolean = true;
  isValidOSPFStaticState: boolean = true;
  isValidOSPFMetric: boolean = true;
  isValidOSPFState: boolean = true;
  isValidOSPFNetworks: boolean = true;

  constructor(
    private store: Store,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer,
    private serverConnectionService: ServerConnectService,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private groupService: GroupService
  ) {
    this.selectNotification$ = this.store.select(selectNotification).subscribe((notification: any) => {
      if (notification) {
        this.showNotification(notification);
      }
    });
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.isEdgeDirectionChecked = mapOption.isEdgeDirectionChecked;
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });

    this.selectGroups$ = this.store.select(selectGroups).subscribe(groups => {
      if (groups) {
        this.groups = groups;
      }
    })
    this.selectNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => this.nodes = nodes);
    this.selectMapPortGroups$ = this.store.select(selectMapPortGroups).subscribe((portGroups: any) => {
      this.portGroups = portGroups;
    });
    this.selectNetmasks$ = this.store.select(selectNetmasks).subscribe((netmasks: any) => {
      this.netmasks = netmasks;
    });
    this.selectMapLinks$ = this.store.select(selectMapLinks).subscribe(mapLinks => this.mapLinks = mapLinks)
    this.selectLinkedMapNodes$ = this.store.select(selectLinkedMapNodes).subscribe(linkedMapNodes => {
      if (linkedMapNodes) {
        this.linkedMapNodes = linkedMapNodes
      }
    })
    this.selectLinkedMapPGs$ = this.store.select(selectLinkedMapPortGroups).subscribe(linkedMapPGs => {
      if (linkedMapPGs) {
        this.linkedMapPGs = linkedMapPGs
      }
    })
    this.selectLinkedMapInterfaces$ = this.store.select(selectLinkedMapInterfaces).subscribe(linkedMapInterfaces => {
      if (linkedMapInterfaces) {
        this.linkedMapInterfaces = linkedMapInterfaces
      }
    })
    this.selectLinkedMapImages$ = this.store.select(selectLinkedMapImages).subscribe(linkedMapImages => {
      if (linkedMapImages) {
        this.linkedMapImages = linkedMapImages
      }
    })
    this.selectInterfacesCommonMapLinks$ = this.store.select(selectInterfacesCommonMapLinks).subscribe(interfacesCommonMapLinks => {
      if (interfacesCommonMapLinks) {
        this.interfacesCommonMapLinks = interfacesCommonMapLinks
      }
    })
    this.selectLogicalMapInterfaces$ = this.store.select(selectLogicalMapInterfaces).subscribe(interfacesLogical => {
      if (interfacesLogical) {
        this.interfacesLogical = interfacesLogical
      }
    })
    this.selectMapImages$ = this.store.select(selectMapImages).subscribe(mapImage => {
      if (mapImage) {
        this.mapImages = mapImage
      }
    });
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectNodes$.unsubscribe();
    this.selectMapPortGroups$.unsubscribe();
    this.selectNetmasks$.unsubscribe();
    this.selectGroups$.unsubscribe();
    this.selectNotification$.unsubscribe();
    this.selectMapLinks$.unsubscribe();
    this.selectLinkedMapNodes$.unsubscribe();
    this.selectLinkedMapPGs$.unsubscribe();
    this.selectLinkedMapInterfaces$.unsubscribe();
    this.selectLinkedMapImages$.unsubscribe();
    this.selectInterfacesCommonMapLinks$.unsubscribe();
    this.selectLogicalMapInterfaces$.unsubscribe();
    this.selectMapImages$.unsubscribe();
  }

  showNotification(notification: any) {
    if (notification.type == 'success') {
      this.toastr.success(notification.message);
    } else if (notification.type == 'error') {
      this.toastr.error(notification.message);
    }
    this.store.dispatch(clearNotification());
  }

  interfaceDisplay(option: any) {
    return option && option.ip ? option.ip : option && option.name ? option.name : '';
  }

  optionDisplay(option: any) {
    return option && option.name ? option.name : '';
  }

  ipAndNameDisplay(option: any) {
    if (option && option.ip) {
      return option.name + '-' + option.ip;
    } else {
      return option.name
    }
  }

  templateDisplay(option: any) {
    return option && option.display_name ? option.display_name : '';
  }

  hardwareDisplay(option: any) {
    return option && option.serial_number ? option.serial_number : '';
  }

  netmaskDisplay(option: any) {
    return option && option.mask ? option.mask : '';
  }

  ipDisplay(option: any) {
    return option && option.ip ? option.ip : '';
  }

  generateCyStyle(defaults: any): any[] {
    return [
      {
        selector: "node",
        style: {
          "content": (ele: any) => ele.data('name'),
          "text-wrap": "wrap",
          "text-opacity": 1,
          "color": defaults.text.color,
          "font-size": defaults.text.size,
          "font-style": "normal",
          "text-valign": "bottom",
          "text-halign": "center",
          "text-outline-color": "#ffffff",
          "text-outline-width": 3,
          "background-fit": "contain",
          "background-image-opacity": 1,
          "z-index": (ele: any) => ele.data('zIndex'),
          "z-compound-depth": "bottom",
          "min-zoomed-font-size": 10
        },
        locked: (ele: any) => ele.data('locked'),
      },

      {
        selector: '[text_color]',
        style: {
          'color': (ele: any) => ele.data('text_color'),
        }
      },
      {
        selector: '[text_size]',
        style: {
          'font-size': (ele: any) => ele.data('text_size'),
        }
      },
      {
        selector: '[text_bg_color]',
        style: {
          'text-background-color': (ele: any) => ele.data('text_bg_color'),
        }
      },
      {
        selector: '[text_bg_opacity]',
        style: {
          'text-background-opacity': (ele: any) => ele.data('text_bg_opacity'),
        }
      },
      {
        selector: '[text_valign]',
        style: {
          'text-valign': (ele: any) => ele.data('text_valign'),
        }
      },
      {
        selector: '[text_halign]',
        style: {
          'text-halign': (ele: any) => ele.data('text_halign'),
        }
      },
      {
        selector: '[border_color]',
        style: {
          'border-color': (ele: any) => ele.data('border_color'),
        }
      },
      {
        selector: '[border_style]',
        style: {
          'border-style': (ele: any) => ele.data('border_style'),
        }
      },
      {
        selector: '[border_width]',
        style: {
          'border-width': (ele: any) => ele.data('border_width'),
        }
      },
      {
        selector: 'node[width][height]',
        style: {
          "height": (ele: any) => ele.data('height'),
          "width": (ele: any) => ele.data('width'),
        }
      },
      {
        selector: '[icon]',
        style: {
          "background-opacity": 0,
          'background-color': '#ffffff',
          "background-image": (ele: any) => ele.data('icon'),
          'shape': "roundrectangle",
        }
      },
      {
        selector: 'node[color]',
        style: {
          "background-color": (ele: any) => ele.data('color'),
        }
      },
      {
        selector: '[font_weight]',
        style: {
          "font-weight": (ele: any) => ele.data('font_weight'),
        }
      },
      {
        selector: 'node[packet]',
        style: {
          "shape": (ele: any) => ele.data('shape'),
          "background-color": (ele: any) => ele.data('color'),
          'text-opacity': 0
        }
      },
      {
        selector: '[elem_category="port_group"]',
        style: {
          'shape': "ellipse",
          "background-opacity": 1,
          'content': (ele: any) => ele.data('subnet'),
        }
      },
      {
        selector: '[label="map_background"]',
        style: {
          'shape': "roundrectangle",
          "background-opacity": 1,
          "background-image": (ele: any) => ele.data('src'),
          "background-fit": "contain",
          "text-opacity": 0,
          "z-index-compare": "manual",
          'content': (ele: any) => ele.data('id'),
        }
      },
      {
        selector: ':parent',
        style: {
          'content': (ele: any) => ele.data('name'),
          'background-opacity': (ele: any) => ele.data('group_opacity') ? ele.data('group_opacity') : .2,
          'background-color': (ele: any) => ele.data('color') ? ele.data('color') : '#00dcff',
          "z-index-compare": "manual"
        }
      },
      {
        selector: ':selected',
        style: {
          'overlay-color': 'blue',
          'overlay-opacity': 0.3,
          'overlay-padding': 5
        }
      },
      {
        selector: 'node.cy-expand-collapse-collapsed-node',
        style: {
          'content': (ele: any) => ele.data('id'),
          'background-color': (ele: any) => ele.data('color') ? ele.data('color') : '#00dcff',
          'background-opacity': (ele: any) => ele.data('group_opacity') ? ele.data('group_opacity') : .2,
          "z-index-compare": "manual",
          'shape': 'rectangle',
        }
      },
      {
        selector: 'node[temp]',
        style: {
          "text-opacity": 0,
          "opacity": 0,
          "z-compound-depth": "bottom",
        }
      },
      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "line-color": defaults.edge.color,
          "width": defaults.edge.size,
          "zIndex": 999,
          "z-compound-depth": "bottom",
          "font-size": 18,
          "text-background-padding": 3,
          "text-background-opacity": 0,
          "text-background-shape": "round-rectangle",
          "text-outline-color": "#ffffff",
          "text-outline-width": 3,
          "text-opacity": 1,
          "text-rotation": "autorotate",
          "arrow-scale": 2,
          "control-point-step-size": 100,
          "min-zoomed-font-size": 9
        },
      },
      {
        selector: "edge[color]",
        style: {
          "line-color": (ele: any) => ele.data('color'),
        },
      },
      {
        selector: "edge[curve_style]",
        style: {
          "curve-style": (ele: any) => ele.data('curve_style'),
        },
      },
      {
        selector: "edge[width]",
        style: {
          "width": (ele: any) => ele.data('width'),
        },
      },
      {
        selector: 'edge[text_size]',
        style: {
          'font-size': (ele: any) => ele.data('text_size'),
        }
      },
      {
        selector: 'edge[text_bg_color]',
        style: {
          'text-background-color': (ele: any) => ele.data('text_bg_color'),
        }
      },
      {
        selector: 'edge[text_bg_opacity]',
        style: {
          'text-background-opacity': (ele: any) => ele.data('text_bg_opacity'),
        }
      },
      {
        selector: "[category='wireless']",
        style: {
          "line-style": "dashed",
          "line-dash-pattern": [20, 60],
          "line-dash-offset": 24
        },
      },
      {
        selector: "[category='link']",
        style: {
          "line-style": (ele: any) => ele.data('line-style')
        },
      },
      {
        selector: "[arrow_scale]",
        style: {
          "arrow-scale": (ele: any) => ele.data('arrow_scale'),
        },
      },
      {
        selector: "[ip_last_octet]",
        style: {
          "content": (ele: any) => ele.data('ip_last_octet'),
        },
      },
      {
        selector: "[source_label]",
        style: {
          "source-label": (ele: any) => ele.data('source_label'),
          "source-text-offset": (ele: any) => (ele.data('source_label').length / 2 * 10) + 15,
          "source-text-rotation": "autorotate",
        }
      },
      {
        selector: "[target_label]",
        style: {
          "target-label": (ele: any) => ele.data('target_label'),
          "target-text-offset": (ele: any) => (ele.data('target_label').length / 2 * 10) + 15,
          "target-text-rotation": "autorotate",
        },
      },
      {
        selector: "[direction='none']",
        style: {
          "target-arrow-shape": undefined,
          "source-arrow-shape": undefined,
        }
      },
      {
        selector: "[direction='both']",
        style: {
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#000000",
          "source-arrow-shape": "triangle",
          "source-arrow-color": "#000000",
        }
      },
      {
        selector: "[direction='both'][color]",
        style: {
          "target-arrow-color": (ele: any) => ele.data('color'),
          "source-arrow-color": (ele: any) => ele.data('color'),
        }
      },
      {
        selector: "[direction='inbound']",
        style: {
          "source-arrow-shape": "triangle",
          "source-arrow-color": "#000000",
        }
      },
      {
        selector: "[direction='inbound'][color]",
        style: {
          "source-arrow-color": (ele: any) => ele.data('color'),
        }
      },
      {
        selector: "[direction='outbound']",
        style: {
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#000000",
        }
      },
      {
        selector: "[direction='outbound'][color]",
        style: {
          "target-arrow-color": (ele: any) => ele.data('color'),
        }
      },
      {
        selector: "node[text_outline_color]",
        style: {
          "text-outline-color": (ele: any) => ele.data('text_outline_color')
        }
      },
      {
        selector: "node[text_outline_width]",
        style: {
          "text-outline-width": (ele: any) => ele.data('text_outline_width')
        }
      },
      {
        selector: "edge[text_outline_color]",
        style: {
          "text-outline-color": (ele: any) => ele.data('text_outline_color')
        }
      },
      {
        selector: "edge[text_outline_width]",
        style: {
          "text-outline-width": (ele: any) => ele.data('text_outline_width')
        }
      },
      {
        selector: "node[?updated][text_outline_width][text_outline_color]",
        style: {
          "text-outline-color": (ele: any) => ele.data('text_outline_color'),
          "text-outline-width": (ele: any) => ele.data('text_outline_width'),
        }
      },
      {
        selector: "edge[?updated][text_outline_width][text_outline_color]",
        style: {
          "text-outline-color": (ele: any) => ele.data('text_outline_color'),
          "text-outline-width": (ele: any) => ele.data('text_outline_width'),
        }
      },
      {
        selector: "[!updated]",
        style: {
          "text-outline-color": "#ffffff",
        }
      }
    ]
  }

  addCYNode(data: any) {
    return this.cy.add({
      group: "nodes",
      data: data.newNodeData ? data.newNodeData : data.data,
      position: data.newNodePosition ? data.newNodePosition : data.position,
    });
  }

  addCYEdge(data: any) {
    return this.cy.add({
      group: "edges",
      data,
    });
  }

  addCYNodeAndEdge(cy: any, nodes: any[], edges: any[], newPosition: any = { x: 0, y: 0 }) {
    // Draw new nodes from the other project into the current project.
    nodes.map((node: any) => {
      let position = null;
      if (node.position) {
        position = { x: newPosition.x + node.position.x, y: newPosition.y + node.position.y }
      }
      this.addCYNode({ newNodeData: node.data, newNodePosition: position });
    })

    // Draw new interfaces from the other project into the current project.
    edges.map((edge: any) => {
      if (edge.data.port_group_id) {
        this.addCYEdge(edge.data);
      }
    })
  }

  removeGroupBoxes() {
    const gbs = this.cy.nodes().filter('[label="group_box"]');
    gbs.forEach((gb: any) => {
      const data = gb.data();
      if (data.collapsedChildren) {
        this.cy.expandCollapse('get').expandRecursively(gb, {});
      }
      const gbNodes = gb.children();
      gbNodes.forEach((node: any) => {
        node.move({ 'parent': null });
      });
      this.cy.remove(gb);
    });
    const gbsTemplate = this.cy.nodes().filter(this.isGroupBoxCreatedFromCdnd)
    gbsTemplate.forEach((gb: any) => {
      this.removeParent(gb)
    })
    return true;
  }

  removeGroupBox(groupBoxId: any) {
    const groupBox = this.cy.getElementById(`group-${groupBoxId}`)
    if (groupBox && groupBox.length > 0) {
      const data = groupBox.data();
      if (data.collapsedChildren) {
        this.cy.expandCollapse('get').expandRecursively(groupBox, {});
      }
      const gbNodes = groupBox.children();
      gbNodes.forEach((node: any) => {
        node.move({ 'parent': null });
      });
      this.cy.remove(groupBox);
    }
  }

  isGroupBoxCreatedFromCdnd(node: any) {
    return Object.values(node.classes()).includes('cdnd-new-parent')
  }

  addGroupBoxes() {
    const gbs = this.groups.filter((gb: any) => gb.data.group_category == this.groupCategoryId);
    this.cy.add(gbs);
    gbs.map(g => {
      this.cy.nodes().forEach((ele: any) => {
        if (!Boolean(ele.data('parent_id')) && ele.data('elem_category') != 'map_link') {
          const data = ele.data();
          if (data.elem_category == 'node' || data.elem_category == 'port_group') {
            const node = g.nodes.find((n: any) => !n.isDeleted && n.id == data.node_id);
            const pg = g.port_groups.find((pg: any) => !pg.isDeleted && pg.id == data.pg_id);
            if (node?.name == 'linux-client-15') {
              console.log(node);
            }
            if (node || pg) {
              ele.move({ parent: g.data.id });
            }
          }
        }
      });
    });

    let done = false;
    for (let i = 0; i < gbs.length; i++) {
      let gb = gbs[i];
      const gbn = this.cy.getElementById(gb.data.id);
      if (gbn.children().length > 0) {
        if (gb.data.collapsed) {
          gb = this.cy.getElementById(gb.data.id);
          const pos = gbn.position();
          this.cy.expandCollapse('get').collapseRecursively(gbn, {});
          gbn.data('width', '90px');
          gbn.data('height', '90px');
          gbn.position(pos);
          if (!done) {
            done = true;
            this.lastWidth = 90;
            this.lastHeight = 90;
          }

        } else {
          this.lastWidth = gbn.renderedWidth();
          this.lastHeight = gbn.renderedHeight();
        }
        if (gb.data.locked) {
          gbn.lock();
        }
      } else {
        this.cy.remove(gbn);
      }
    }
    const z = this.cy.zoom();
    const cyW = this.cy.container().clientWidth;
    const cyH = this.cy.container().clientHeight;
    const nW = this.lastWidth || 100;
    const nH = this.lastHeight || 100;
    const lim = (nW * nH * z) / (cyW * cyH);
    this.zoomLimit = lim < 0.0005;
    this.cy.resize();
    return true;
  }

  reloadGroupBoxes() {
    if (this.isGroupBoxesChecked) {
      this.removeGroupBoxes();
      this.addGroupBoxes();
    }
  }

  addNewGroupBoxByMovingNodes(cy: any, dropTarget: any, projectId: any, mapCategory: string) {
    if (dropTarget.data() && dropTarget.data('elem_category') != 'group' && dropTarget.hasClass('cdnd-new-parent')) {
      const children = dropTarget.children()
      if (children.length == 2) {
        const g0 = children[0].map((ele: any) => ele.data('groups'))[0].map((g: any) => g.id).sort()
        const g1 = children[1].map((ele: any) => ele.data('groups'))[0].map((g: any) => g.id).sort()
        const isBelongedOneGroup = g0.some((g: any) => g1.includes(g))
        if (g0.length == 0 || g1.length == 0 || !isBelongedOneGroup) {
          const nodes = children.filter('[elem_category="node"]')
          const portGroups = children.filter('[elem_category="port_group"]')
          const mapImages = children.filter('[elem_category="bg_image"]')
          const dialogData = {
            mode: 'add',
            genData: {
              nodes,
              port_groups: portGroups,
              map_images: mapImages
            },
            project_id: projectId,
            map_category: mapCategory
          };
          const dialog = this.dialog.open(AddUpdateGroupDialogComponent,
            { disableClose: true, width: '600px', autoFocus: false, data: dialogData }
          );
          dialog.afterClosed().subscribe((dialogResult: any) => {
            if (dialogResult && dialogResult.isCanceled) {
              if (nodes.length > 0 || portGroups.length > 0 || mapImages.length > 0) {
                this.reloadGroupBoxes();
              }
            }
          })
        }
        else {
          this.toastr.info('Two nodes belonged to a group box', 'Info')
          this.reloadGroupBoxes();
        }
      }
    }
  }

  updateInterfaceOnEle(cy: any, id: string, new_interface: any) {
    const ele = cy.getElementById(id);
    const interfaces = ele.data('interfaces')
    if (interfaces) {
      let interfacesArr = [...interfaces]
      interfacesArr.forEach((item: any, index: number, array: any) => {
        if (item.id == new_interface.id) {
          array[index] = new_interface;
        }
      });
      ele.data('interfaces', interfacesArr);
    } else {
      ele.data('interfaces', [new_interface]);
    }
  }

  updateInterfaceOnMap(id: string, data: any) {
    const ele = this.cy.getElementById(id);
    ele.data('name', data.name);
    ele.data('order', data.order);
    ele.data('description', data.description);
    ele.data('category', data.category);
    ele.data('direction', data.direction);
    ele.data('mac_address', data.mac_address);
    ele.data('port_group_id', data.port_group_id);
    ele.data('port_group', data.port_group_id ? this.getOptionById(this.portGroups, data.port_group_id).name : '');
    ele.data('ip_allocation', data.ip_allocation);
    ele.data('ip', data.ip);
    ele.data('dns_server', data.dns_server);
    ele.data('gateway', data.gateway);
    ele.data('is_gateway', data.is_gateway);
    ele.data('is_nat', data.is_nat);
    const ip_str = data.ip ? data.ip : "";
    const ip = ip_str.split(".");
    const last_octet = ip.length == 4 ? "." + ip[3] : "";
    ele.data('ip_last_octet', last_octet);
    ele.data('target', `pg-${data.port_group_id}`);
    ele.data('netmask_id', data.netmask_id);
    ele.data('vlan', data.vlan);
    ele.data('vlan_mode', data.vlan_mode);
    ele.data('netmask', data.netmask_id ? this.getOptionById(this.netmasks, data.netmask_id).mask : '');
    ele.data('source_label', data.name);
  }

  removeInterfaceOnPG(cy: any, pgId: number, interfaceId: number) {
    const pgEle = cy.getElementById(`pg-${pgId}`)
    const interfaces = pgEle.data('interfaces')
    const index = interfaces.findIndex((i: any) => i.id === interfaceId)
    if (index !== -1) {
      interfaces.splice(index, 1)
    }
    pgEle.data('interfaces', interfaces)
  }

  addInterfaceIntoElement(cy: any, pgId: number, edge: any, type: string = 'node') {
    const element = cy.getElementById(`${type}-${pgId}`)
    const currentInterfaces = element.data('interfaces')
    const newInterfaces = currentInterfaces ? [...currentInterfaces, edge] : [edge]
    element.data('interfaces', newInterfaces)
  }

  createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  collapseAndExpandMapLinkNodeEvent(mapLinkNode: any) {
    // Set event collapse and expand
    mapLinkNode.on('expandcollapse.aftercollapse', (event: any) => {
      mapLinkNode.data('width', '90px')
      mapLinkNode.data('height', '90px')
      mapLinkNode.data('updated', true);
      mapLinkNode.data('collapsed', true);
      mapLinkNode.data('lastPos', mapLinkNode.position())
      mapLinkNode.style({
        'background-opacity': '0',
        'background-color': '#fff',
        'background-image-opacity': 1,
      });
    })

    mapLinkNode.on('expandcollapse.afterexpand', (event: any) => {
      mapLinkNode.data('width', '90px');
      mapLinkNode.data('height', '90px');
      mapLinkNode.data('updated', true);
      mapLinkNode.data('collapsed', false);
      mapLinkNode.data('lastPos', mapLinkNode.position());
      mapLinkNode.style({
        'background-opacity': '.20',
        'background-color': '#00dcff',
        'background-image-opacity': 0,
      });
      this.randomPositionForElementsNoPosition(event.cy)
      this.changeEdgeDirectionOnMap(event.cy, this.isEdgeDirectionChecked)
    })
  }

  randomPositionForElementsNoPosition(cy: any) {
    // Random position for the nodes if the map has layout preset however the nodes don't have the position
    const elementsNoPosition = cy.elements().filter((ele: any) =>
      ((
        ele.group() == 'nodes' &&
        ((ele.position('x') === 0 && ele.position('y') === 0) || ele.position() == undefined))
      ));
    if (elementsNoPosition.length > 0) {
      cy.elements().filter((ele: any) => (
        (ele.position('x') !== 0 && ele.position('y') !== 0) && ele.position() !== undefined)
      ).lock();
      cy.layout({
        name: "cose",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 5,
        fit: true,
        animate: false,
        padding: 150
      }).run();
      cy.elements().unlock();
    }
  }

  getOptionById(options: any, id: string) {
    const option = options?.filter((option: any) => option.id == id)[0];
    return option ? option : {};
  }

  getOption(options: any, value: string, optionColumn: string = 'name') {
    const option = options?.filter((option: any) => option[optionColumn] == value)[0];
    return option ? option : {};
  }

  setAutoCompleteValue(control: any, options: any, id: string) {
    if (id) {
      control.setValue(this.getOptionById(options, id));
    }
  }

  getAutoCompleteCtr(control: any, options: any, optionColumn: string = 'name') {
    if (typeof control?.value === 'string') {
      const option = this.getOption(options, control?.value, optionColumn);
      if (option && option.id) {
        control.setValue(option);
      }
    }
    return control;
  }

  filterOptions(control: any, options: any[], optionColumn: string = 'name') {
    return control.valueChanges.pipe(
      startWith(''),
      map((value: any | string) => {
        const typeOfValue = typeof value;
        if (typeOfValue === 'object') {
          return options;
        }
        const text = typeOfValue === 'string' ? value.toLowerCase() : value[optionColumn];
        const filteredOptions = options?.filter((option: any) => option[optionColumn]?.toLowerCase().includes(text));
        return filteredOptions.length > 0 ? filteredOptions : options;
      }),
    );
  }

  filterOptionsPortGroup(control: any, options: any[]) {
    return control.valueChanges.pipe(
      startWith(''),
      map((value: any | string) => {
        const typeOfValue = typeof value;
        if (typeOfValue === 'object') {
          return options;
        }
        const text = typeOfValue === 'string' ? value.toLowerCase() : value['name'];
        const filteredOptions = options?.filter((option: any) => option['name']?.toLowerCase().includes(text)
          || option['subnet']?.toLowerCase().includes(text)
          || option['vlan']?.toString().toLowerCase().includes(text));
        return filteredOptions.length > 0 ? filteredOptions : options;
      }),
    );
  }

  removeNodesOnMap(ids: number[]) {
    if (ids.length > 0) this.ur?.do("removeNodes", { ids });
  }

  removePGsOnMap(ids: number[]) {
    if (ids.length > 0) this.ur?.do("removePGs", { ids });
  }

  removeInterfacesOnMap(ids: number[]) {
    if (ids.length > 0) this.ur?.do("removeInterfaces", { ids });
  }

  removeNodes(data: any) {
    const eles = data.ids.map((id: number) => {
      const node = this.cy.getElementById(`node-${id}`);
      const removedEles = node.remove();
      const removedInterfaces = removedEles.filter((ele: any) => ele.data('elem_category') == 'interface');
      if (removedInterfaces.length > 0) {
        const removedInterfaceIds = removedInterfaces.map((i: any) => i.data('interface_pk'));
        this.store.dispatch(removeInterfaces({ ids: removedInterfaceIds }));
      }
      return removedEles;
    })
    this.store.dispatch(removeNodes({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  restoreNodes(data: any) {
    const eles = data.eles.map((e: any) => {
      const restoredEles = e.restore();
      const restoredInterfaces = restoredEles.filter((ele: any) => ele.data('elem_category') == 'interface');
      if (restoredInterfaces.length > 0) {
        const restoredInterfaceIds = restoredInterfaces.map((i: any) => i.data('interface_pk'));
        this.store.dispatch(restoreInterfaces({ ids: restoredInterfaceIds }));
      }
      return restoredEles;
    });
    this.store.dispatch(restoreNodes({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  removePGs(data: any) {
    const eles = data.ids.map((id: number) => {
      const node = this.cy.getElementById(`pg-${id}`);
      const removedEles = node.remove();
      const removedInterfaces = removedEles.filter((ele: any) => ele.data('elem_category') == 'interface');
      if (removedInterfaces.length > 0) {
        const removedInterfaceIds = removedInterfaces.map((i: any) => i.data('interface_pk'));
        this.store.dispatch(removeInterfaces({ ids: removedInterfaceIds }));
      }
      return removedEles;
    })
    this.store.dispatch(removePGs({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  restorePGs(data: any) {
    const eles = data.eles.map((e: any) => {
      const restoredEles = e.restore();
      const restoredInterfaces = restoredEles.filter((ele: any) => ele.data('elem_category') == 'interface');
      if (restoredInterfaces.length > 0) {
        const restoredInterfaceIds = restoredInterfaces.map((i: any) => i.data('interface_pk'));
        this.store.dispatch(restoreInterfaces({ ids: restoredInterfaceIds }));
      }
      return restoredEles;
    });
    this.store.dispatch(restorePGs({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  removeInterfaces(data: any) {
    const eles = data.ids.map((id: number) => {
      const i = this.cy.getElementById(`interface-${id}`);
      return i.remove();
    })
    this.store.dispatch(removeInterfaces({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  restoreInterfaces(data: any) {
    const eles = data.eles.map((e: any) => e.restore());
    this.store.dispatch(restoreInterfaces({ ids: data.ids }));
    return { ids: data.ids, eles };
  }

  isParentOfOneChild(node: any) {
    return (node.isParent() && (node.children().length === 1 && node.data('elem_category') != 'group')) ||
      (node.children().length === 0 && node.data('elem_category') == 'group')
  }

  removeParent(parent: any) {
    parent.children().move({ parent: null })
    parent.remove();
  }

  removeParentsOfOneChild(cy: any) {
    cy.nodes().filter(this.isParentOfOneChild).forEach(this.removeParent)
  }

  addBadge(cy: any, ele: any) {
    this.removeBadge(ele);
    const popper = ele.popper({
      content: () => {
        const badge = document.createElement('div');
        badge.id = `popper-${ele.id()}`;
        badge.innerHTML = `<img src="assets/icons/lock.png" width="10" height="10">`
        badge.setAttribute("style", "z-index:1;");
        document.getElementById('cy')?.appendChild(badge);
        return badge;
      },
      popper: {
        placement: 'top-end'
      }
    });
    ele.on('position', () => {
      popper.update();
    });

    ele.cy().on('pan zoom resize', () => {
      popper.update();
    });
  }

  removeBadge(ele: any) {
    const badgeId = `popper-${ele.id()}`;
    const existingTarget = document.getElementById(badgeId);
    if (existingTarget) {
      existingTarget.remove();
    }
  }

  hexToRGB(hexColor: string) {
    const hexPattern = '#d{0,}'
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString()
      const g = parseInt(hexColor.slice(3, 5), 16).toString()
      const b = parseInt(hexColor.slice(5, 7), 16).toString()
      return "rgb(" + r + ',' + g + ',' + b + ")"
    }
    return undefined;
  }

  fullColorHex(rgbColor: any) {
    // check if value is already in a hex format
    const hexPattern = '#\d{0,}'
    const hexPatternFound = rgbColor.match(hexPattern)
    if (hexPatternFound != null) {
      return (rgbColor)
    }
    else if (rgbColor.match("rgb\\((\\d{1,},\\d{1,},\\d{1,})")) {
      const rgbArray = rgbColor.match("rgb\\((\\d{1,},\\d{1,},\\d{1,})"); // retrieves the RGB numbers into an array
      let rgb = rgbArray[1];
      rgb = rgb.split(","); // split the RGB color array
      const red = this.rgbToHex(rgb[0]);
      const green = this.rgbToHex(rgb[1]);
      const blue = this.rgbToHex(rgb[2]);
      return "#" + red + green + blue;
    } else {
      return rgbColor
    }
  }

  rgbToHex(rgb: any) {
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  }

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // tslint:disable-next-line:no-string-throw
        throw 'Illegal base64url string!';
    }
    return decodeURIComponent((<any>window).escape(window.atob(output)));
  }

  public decodeToken(token: string = '') {
    if (token === null || token === '') { return { 'upn': '' }; }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  public downloadBlob(fileName: string, blob: Blob): void {
    const anchor = window.document.createElement('a');
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
  }

  downloadBlobWithData(data: any, fileName: string) {
    let file = new Blob([JSON.stringify(data, null, 4)], { type: 'application/json' });
    this.downloadBlob(fileName, file);
  }

  public setIconPath(url: string): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getDateformatYYYYMMDDHHMMSS(date: Date) {
    const year = '' + date.getFullYear();
    let month = '' + (date.getMonth() + 1); if (month.length == 1) { month = '0' + month; }
    let day = '' + date.getDate(); if (day.length == 1) { day = '0' + day; }
    let hour = '' + date.getHours(); if (hour.length == 1) { hour = '0' + hour; }
    let minute = '' + date.getMinutes(); if (minute.length == 1) { minute = '0' + minute; }
    let second = '' + date.getSeconds(); if (second.length == 1) { second = '0' + second; }
    return year + month + day + '-' + hour + minute + second;
  }

  removeLeadingAndTrailingWhitespace(object: any) {
    return Object.keys(object).reduce((acc: any, curr: any) => {
      acc[curr] = typeof object[curr] == 'string' ? object[curr].trim() : object[curr]
      return acc;
    }, {});
  }

  sortListByKeyInObject(array: any[], key: string = 'name') {
    return array.sort((a: any, b: any) => {
      if (a[key].toLowerCase() < b[key].toLowerCase()) return -1
      return a[key].toLowerCase() > b[key].toLowerCase() ? 1 : 0
    })
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  processIpForm(data: string) {
    let arr: any[] = [];
    if (data?.length == 0) {
      arr = []
    } else if (data?.length > 1) {
      const value = data.split(',');
      for (let i = 0; i < value.length; i++) {
        arr.push({
          "ip": value[i].trim(),
        })
      }
    }
    return arr
  }

  setterValue(params: any) {
    const newValue = params.newValue;
    const data = params.data;
    const field = params.colDef.field
    const typeOfValidation = validateIP(params, newValue)
    if (newValue === '' && field == 'network') {
      this.toastr.warning(ErrorMessages.FIELD_IS_REQUIRED)
      return false
    }

    switch (typeOfValidation) {
      case 'ip in network':
        this.toastr.warning(ErrorMessages.IP_IN_NETWORK)
        return false
      case 'validation reserved_ip':
        this.toastr.warning(ErrorMessages.FIELD_IS_IP)
        return false
      case 'network is exists':
        this.toastr.warning(ErrorMessages.NETWORK_EXISTS)
        return false
      case 'validation network':
        this.toastr.warning(ErrorMessages.FIELD_IS_IP)
        return false
      default:
        data[`${field}`] = newValue
        return true

    }
  }

  validateRequiredInCell(newValue: any) {
    const isValueValid = newValue && newValue.trim();
    if (isValueValid) {
      return true;
    } {
      this.toastr.error(ErrorMessages.FIELD_IS_REQUIRED, 'Error');
      return false;
    }
  }

  validateLengthRangeInCell(newValue: any, minLength: number, maxLength: number) {
    const isValueValid = newValue && newValue.trim() && (newValue.length >= minLength && newValue.length <= maxLength);
    if (isValueValid) {
      return true;
    } else {
      this.toastr.error(ErrorMessages.RANGE_LENGTH_2_TO_20, 'Error');
      return false;
    }
  }

  validateCharacterInCell(newValue: any) {
    const regex = /^[a-zA-Z\s]*$/;
    const isValueCharacter = regex.test(newValue);
    if (isValueCharacter) {
      return true;
    } else {
      this.toastr.error(ErrorMessages.FIELD_IS_ALPHABET, 'Error');
      return false;
    }
  }

  validateNumberInCell(newValue: any) {
    const regex = /^\d+$/;
    const isNumber = regex.test(newValue);
    if (isNumber) {
      return true;
    } else {
      this.toastr.error(ErrorMessages.FIELD_IS_NUMBER, 'Error');
      return false;
    }
  }

  addNewNodeToMap(id: number) {
    const cyNodeData = this.nodes.find((n: any) => n.id == id);
    this.addCYNode(JSON.parse(JSON.stringify(cyNodeData)));
  }

  addTemplateItemsToMap(data: any, newPosition: { x: number, y: number }) {
    const newNodeIds = data.node_ids;
    const newPGIds = data.port_group_ids;
    const mapImageIds = data.map_image_ids;
    const newInterfaceIds = data.interface_ids;
    const nodes = this.nodes.filter((node: any) => newNodeIds.includes(node.id));
    const portGroups = this.portGroups.filter((pg: any) => pg.category !== 'management' && newPGIds.includes(pg.id));
    const mapImages = this.mapImages.filter((mi: any) => mapImageIds.includes(mi.id));
    const interfaces = JSON.parse(JSON.stringify(this.interfacesLogical.filter((i: any) => newInterfaceIds.includes(i.id))));
    const elements = JSON.parse(JSON.stringify([...nodes, ...portGroups, ...mapImages]));
    const isNodesHasPosition = elements.every((node: any) =>
      node.position && node.position?.x !== 0 && node.position?.y !== 0
    );
    if (isNodesHasPosition) {
      this.addCYNodeAndEdge(this.cy, elements, interfaces, newPosition);
      this.store.dispatch(retrievedMapContextMenu({ data: { event: 'save' } }));
    } else {
      this.cy.elements().lock();
      this.addCYNodeAndEdge(this.cy, elements, interfaces);
      this.cy.layout({
        name: "cose",
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 5,
        fit: true,
        animate: false,
        padding: 150
      }).run();
      this.cy.elements().unlock();
    }
    this.changeEdgeDirectionOnMap(this.cy, this.isEdgeDirectionChecked);
    this.store.dispatch(validateProject({ projectId: this.projectService.getProjectId() }))
  }

  updateNodeOnMap(id: string, data: any) {
    const ele = this.cy.getElementById(id);
    ele.data('name', data.name);
    ele.data('notes', data.notes);
    ele.data('icon', ICON_PATH + data.icon.photo);
    ele.data('icon_id', data.icon_id);
    ele.data('category', data.category);
    ele.data('device', data.device);
    ele.data('device_id', data.device_id);
    ele.data('template', data.template);
    ele.data('template_id', data.template_id);
    ele.data('hardware', data.hardware);
    ele.data('hardware_id', data.hardware_id);
    ele.data('folder', data.folder);
    ele.data('parent_folder', data.parent_folder);
    ele.data('role', data.role);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('hostname', data.hostname);
    ele.data('login_profile_id', data.login_profile_id);
    ele.data('login_profile_show', data.login_profile_show);
    ele.data('login_profile', data.login_profile?.name);
    ele.data('configs', data.configs);
    ele.data('configuration_show', data.configuration_show);
    ele.data('groups', data.groups);
    ele.data('interfaces', data.interfaces);
    ele.data('infrastructure', data.infrastructure);
  }

  updatePGOnMap(id: any, data: any) {
    const ele = this.cy.getElementById(id);
    ele.data('name', data.name);
    ele.data('vlan', data.vlan);
    ele.data('category', data.category);
    ele.data('subnet_allocation', data.subnet_allocation);
    ele.data('subnet', data.subnet);
    ele.data('groups', data.groups);
    ele.data('domain', data.domain);
    ele.data('domain_id', data.domain_id);
    ele.data('interfaces', data.interfaces);
  }

  initCollapseExpandMapLink() {
    // Add parent for the elements related to the map link
    const nodeRelatedMapLink = this.cy.elements().filter((ele: any) =>
      (ele.group() == 'nodes' && ele.data('parent_id'))
    )
    nodeRelatedMapLink.forEach((node: any) => {
      node.move({ parent: `project-link-${node.data('parent_id')}` });
    })

    // Set initial collapse and expand based on the project node data
    const mapLinkNodes = this.cy.nodes().filter((node: any) => node.data('elem_category') == 'map_link' && !Boolean(node.data('parent_id')))
    mapLinkNodes.map((mapLinkNode: any) => {
      if (mapLinkNode.data('collapsed')) {
        this.cy.expandCollapse('get').collapseRecursively(mapLinkNode, {});
        mapLinkNode.data('width', '90px');
        mapLinkNode.data('height', '90px');
        mapLinkNode.style({
          'background-opacity': '0',
          'background-color': '#fff',
          'background-image-opacity': 1,
        });
      } else {
        mapLinkNode.style({
          'background-opacity': '.20',
          'background-color': '#00dcff',
          'background-image-opacity': 0,
        });
      }
    })

    // Set events before and after the collapse and expand.
    mapLinkNodes.map((mapLinkNode: any) => {
      this.collapseAndExpandMapLinkNodeEvent(mapLinkNode);
    })
    this.randomPositionForElementsNoPosition(this.cy)
    this.changeEdgeDirectionOnMap(this.cy, this.isEdgeDirectionChecked)
  }

  validateJSONFormat(json: any) {
    try {
      const configData = JSON.parse(json)
      return true;
    } catch (error: any) {
      this.toastr.warning(`The default configuration is not the correct format JSON: <br> ${error.message}`,
        'Waring', { enableHtml: true }
      )
      return false;
    }
  }

  validateFieldFormat(json: any) {
    const configData = JSON.parse(json)
    const ospfData = configData['ospf']
    if (ospfData && ospfData.length > 0) {
      ospfData.every((data: any) => {
        const bgpMetric = data.redistribute.bgp.metric_type
        const connectedMetric = data.redistribute.connected.metric_type
        const StaticMetric = data.redistribute.static.metric_type
        this.isValidOSPFBgpMetric = Number.isInteger(bgpMetric) && (bgpMetric > 0) && (bgpMetric < 3)
        this.isValidOSPFConnectedMetric = Number.isInteger(connectedMetric) && (connectedMetric > 0) && (connectedMetric < 3)
        this.isValidOSPFStaticMetric = Number.isInteger(StaticMetric) && (StaticMetric > 0) && (StaticMetric < 3)
        this.isValidOSPFBgpState = (typeof data.redistribute.bgp.state === 'boolean')
        this.isValidOSPFConnectedState = (typeof data.redistribute.connected.state === 'boolean')
        this.isValidOSPFStaticState = (typeof data.redistribute.static.state === 'boolean')

        this.isValidOSPFMetric = this.isValidOSPFBgpMetric && this.isValidOSPFConnectedMetric && this.isValidOSPFStaticMetric
        this.isValidOSPFState = this.isValidOSPFBgpState && this.isValidOSPFConnectedState && this.isValidOSPFStaticState
        this.isValidOSPFNetworks = this.validationNetwork(data.networks)
        return (this.isValidOSPFMetric && this.isValidOSPFState && this.isValidOSPFNetworks)
      })
    }
    if (!this.isValidOSPFMetric) {
      this.toastr.warning(`The metric type field is invalid. Metric Type should be an integer and only have the values 1 or 2.`)
      return false
    } else if (!this.isValidOSPFState) {
      this.toastr.warning(`The state field is invalid. State field should contain only true or false values`)
      return false
    } else if (!this.isValidOSPFNetworks) {
      this.toastr.warning(`The network field is invalid. Expected 4 octets and only decimal digits permitted.`)
      return false
    } else {
      return true;
    }
  }

  validationNetwork(data: any) {
    const isSubnet = require("is-subnet");
    let isValidNetworks: boolean = true;
    let isIpV4: boolean = true;
    if (data && data.length > 0) {
      if (Array.isArray(data)) {
        data.every((val: any) => {
          isIpV4 = isIPv4(val)
          isValidNetworks = (isIpV4)
          if (val.includes('/')) {
            isIpV4 = isIPv4(val.split('/')[0])
            const isMatchSubnet = isSubnet(val)
            isValidNetworks = (isIpV4 && isMatchSubnet)
          }
          return isValidNetworks
        })
      } else {
        isIpV4 = isIPv4(data)
        isValidNetworks = (isIpV4)
        if (data.includes('/')) {
          isIpV4 = isIPv4(data.split('/')[0])
          const isMatchSubnet = isSubnet(data)
          isValidNetworks = (isIpV4 && isMatchSubnet)
        } else {
          isValidNetworks = isIpV4
        }
      }
    }
    return isValidNetworks;
  }

  validationBGP(json: any) {
    let isValidBGPConnectedMetric: boolean = true;
    let isValidBGPOSPFMetric: boolean = true;
    let isValidBGPConnectedState: boolean = true;
    let isValidBGPOSPFState: boolean = true;
    let isValidBGPMetric: boolean = true;
    let isValidBGPState: boolean = true;
    let isValidBGPIPAddress: boolean = true;
    let isValidBGPNeighborIP: boolean = true;
    let isValidBGPNetworks: boolean = true;
    const configData = JSON.parse(json)
    const bgpData = configData['bgp']
    if (bgpData && bgpData.length > 0) {
      bgpData.every((data: any) => {
        const connectedMetric = data.redistribute.connected.metric
        const ospfMetric = data.redistribute.ospf.metric
        isValidBGPConnectedMetric = Number.isInteger(connectedMetric)
        isValidBGPOSPFMetric = Number.isInteger(ospfMetric)
        isValidBGPConnectedState = (typeof data.redistribute.connected.state === 'boolean')
        isValidBGPOSPFState = (typeof data.redistribute.ospf.state === 'boolean')
        isValidBGPIPAddress = this.validationNetwork(data.ip_address)
        isValidBGPNeighborIP = this.validationNetwork(data.neighbor_ip)
        isValidBGPMetric = isValidBGPConnectedMetric && isValidBGPOSPFMetric
        isValidBGPState = isValidBGPConnectedState && isValidBGPOSPFState
        isValidBGPNetworks = isValidBGPIPAddress && isValidBGPNeighborIP
        return (isValidBGPMetric && isValidBGPState && isValidBGPNetworks)
      })
    }
    if (!isValidBGPMetric) {
      this.toastr.warning('The metric field is invalid. Metric should be an integer.')
      return false
    } else if (!isValidBGPState) {
      this.toastr.warning('The state field is invalid. State field should contain only true or false values')
      return false
    } else if (!isValidBGPNetworks) {
      this.toastr.warning('The ip address is invalid. Expected 4 octets and only decimal digits permitted.')
      return false
    } else {
      return true;
    }
  }

  validateDHCPData(editorData: any) {
    const configData = JSON.parse(editorData)
    const dhcpData = configData['dhcp_server']
    const isLeaseNumber = Number.isInteger(dhcpData.lease)
    if (!isLeaseNumber) {
      this.toastr.warning('Lease property in DHCP server is a number field', 'Warning');
      return false;
    }

    const isAuthoritativeValid = (typeof dhcpData.authoritative === 'boolean')
    if (!isAuthoritativeValid) {
      this.toastr.warning('Authoritative property in DHCP server should have true or false values', 'Warning');
      return false;
    }

    const isValidDNSServer = this.validationNetwork(dhcpData.dns_server)
    if (!isValidDNSServer) {
      this.toastr.warning(
        'The DNS server property in DHCP server is invalid.<br>Expected 4 octets and only decimal digits permitted.',
        'Warning',
        { enableHtml: true }
      );
      return false;
    }

    const isValidNTPServer = this.validationNetwork(dhcpData.ntp_server)
    if (!isValidNTPServer) {
      this.toastr.warning(
        'The NTP server property in DHCP server is invalid.<br>Expected 4 octets and only decimal digits permitted.',
        'Warning',
        { enableHtml: true }
      );
      return false;
    }

    const startRanges = dhcpData.ranges.map((range: RangeModel) => range.start)
    const isStartRangesValid = this.validationNetwork(startRanges)
    if (!isStartRangesValid) {
      this.toastr.warning(
        'The start property in Range is invalid.<br>Expected 4 octets and only decimal digits permitted.',
        'Warning',
        { enableHtml: true }
      );
      return false;
    }

    const stopRanges = dhcpData.ranges.map((range: RangeModel) => range.stop)
    const isStopRangesValid = this.validationNetwork(stopRanges)
    if (!isStopRangesValid) {
      this.toastr.warning(
        'The stop property in Range is invalid.<br>Expected 4 octets and only decimal digits permitted.',
        'Warning',
        { enableHtml: true }
      );
      return false;
    }

    const ipAddressReservation = dhcpData.ip_reservations.map((ipReservation: IpReservationModel) => ipReservation.ip_address)
    const isIpAddressValid = this.validationNetwork(ipAddressReservation)
    if (!isIpAddressValid) {
      this.toastr.warning(
        'The IP address property in Reservation is invalid.<br>Expected 4 octets and only decimal digits permitted.',
        'Warning',
        { enableHtml: true }
      );
      return false;
    }
    return true;
  }


  processNetworksField(data: string) {
    const arr: any[] = [];
    if (!data || data === "") {
      return []
    } else {
      const value = data.split(',');
      for (let i = 0; i < value.length; i++) {
        arr.push(value[i].trim())
      }
      return arr
    }
  }

  changeConnectionStatus(category: string, status: boolean) {
    switch (category) {
      case RemoteCategories.HYPERVISOR:
        this.store.dispatch(retrievedIsHypervisorConnect({ data: status }));
        break;
      case RemoteCategories.DATASOURCE:
        this.store.dispatch(retrievedIsDatasourceConnect({ data: status }));
        break;
      case RemoteCategories.CONFIGURATOR:
        this.store.dispatch(retrievedIsConfiguratorConnect({ data: status }));
        break;
      default:
        this.toastr.warning('The connection category is not match', 'Warning')
    }
  }

  getConfigAddsTypeByDeviceCategory(deviceCategory: string | string[]) {
    if (deviceCategory.includes('Firewall')) {
      return this.configTemplateAddsType.filter(
        addType => addType.id == 'add_firewall_rule' || addType.id == 'add_route'
      );
    } else if (deviceCategory.includes('Router')) {
      return this.configTemplateAddsType.filter(
        addType => addType.id == 'add_firewall_rule' || addType.id == 'add_route' || addType.id == 'add_ospf' || addType.id == 'add_bgp'
      );
    } else if (deviceCategory.includes('Windows Server')) {
      return this.configTemplateAddsType.filter(
        addType => addType.id == 'add_roles_service' || addType.id == 'add_domain_membership'
      );
    } else if (deviceCategory.includes('Windows Client') || deviceCategory.includes('Linux Client')) {
      return this.configTemplateAddsType.filter(addType => addType.id == 'add_domain_membership');
    } else {
      return this.configTemplateAddsType.filter(addType => addType.id != 'add_ospf' && addType.id != 'add_bgp')
    }
  }

  initialConnectionStatus() {
    const connectionHypervisor = this.serverConnectionService.getConnection(RemoteCategories.HYPERVISOR);
    if (connectionHypervisor && connectionHypervisor.id !== 0) {
      this.store.dispatch(retrievedIsHypervisorConnect({ data: true }));
    }
    const connectionDatasource = this.serverConnectionService.getConnection(RemoteCategories.DATASOURCE);
    if (connectionDatasource && connectionDatasource.id !== 0) {
      this.store.dispatch(retrievedIsDatasourceConnect({ data: true }));
    }
    const connectionConfigurator = this.serverConnectionService.getConnection(RemoteCategories.CONFIGURATOR);
    if (connectionConfigurator && connectionConfigurator.id !== 0) {
      this.store.dispatch(retrievedIsConfiguratorConnect({ data: true }));
    }
  }

  showOrHideArrowDirectionOnEdge(id: number) {
    const edge = this.cy.getElementById(`interface-${id}`);
    if (!this.isEdgeDirectionChecked) {
      const current_dir = edge.data('direction');
      edge.data('prev_direction', current_dir);
      edge.data('direction', 'none');
    }
  }

  changeEdgeDirectionOnMap(cy: any, isEdgeDirectionChecked: boolean) {
    if (!isEdgeDirectionChecked) {
      for (let i = 0; i < cy.edges().length; i++) {
        const edge = cy.edges()[i];
        const current_dir = edge.data('direction');
        edge.data('prev_direction', current_dir);
        edge.data('direction', 'none');
      }
    } else {
      for (let i = 0; i < cy.edges().length; i++) {
        const edge = cy.edges()[i];
        let prev_dir = edge.data('prev_direction');
        const current_dir = edge.data('direction');
        if (current_dir == 'none') {
          if (!prev_dir || prev_dir == 'none') {
            prev_dir = 'both';
          }
          edge.data('direction', prev_dir)
        }
      }
    }
  }

  addNewMapLinkToMap(id: number) {
    const mapLink = this.mapLinks.find(m => m.id === id)
    this.addCYNode(JSON.parse(JSON.stringify(mapLink)))
  }

  addLinkedElementsToMap() {
    JSON.parse(JSON.stringify(this.linkedMapNodes)).map((node: any) => {
      this.addCYNode(node)
    })
    JSON.parse(JSON.stringify(this.linkedMapPGs)).map((portGroup: any) => {
      this.addCYNode(portGroup)
    })
    JSON.parse(JSON.stringify(this.linkedMapImages)).map((mi: any) => {
      this.addCYNode(mi)
    })
    JSON.parse(JSON.stringify(this.linkedMapInterfaces)).map((edge: any) => {
      this.addCYEdge(edge.data)
    })
    this.initCollapseExpandMapLink()
    this.store.dispatch(clearLinkedMap())
  }

  addInterfaceMapLinkToMap(id: number) {
    const edge = this.interfacesCommonMapLinks.find(e => e.id === id);
    if (edge) {
      this.addCYEdge(JSON.parse(JSON.stringify(edge.data)));
      this.showOrHideArrowDirectionOnEdge(edge.id);
    }
  }

  addInterfacesLogicalToMap(edges: any[]) {
    edges.map(edge => {
      this.addInterfaceLogicalToMap(edge.id);
    });
  }

  addInterfaceLogicalToMap(id: number) {
    const edge = this.interfacesLogical.find(e => e.id === id);
    if (edge) {
      this.addCYEdge(JSON.parse(JSON.stringify(edge.data)));
      this.showOrHideArrowDirectionOnEdge(edge.id);
    }
  }

  addPGToMap(id: number) {
    const portGroup = this.portGroups.find(pg => pg.id === id)
    this.addCYNode(JSON.parse(JSON.stringify(portGroup)))
  }

  updateSubnetPgOnMap(pgData: any) {
    const element = this.cy.getElementById('pg-' + pgData.id);
    element.data('subnet', pgData.subnet);
    element.data('name', pgData.name);
  }
}
