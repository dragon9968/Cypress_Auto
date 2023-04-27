import { Store } from '@ngrx/store';
import { map, startWith, Subscription } from 'rxjs';
import { Injectable, Input, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { selectGroupBoxes } from 'src/app/store/map/map.selectors';
import { FormControl, FormGroup } from '@angular/forms';
import { validatieIP } from 'src/app/shared/validations/ip-subnet.validation.ag-grid';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';
import { selectNodesByCollectionId } from "../../../store/node/node.selectors";
import { retrievedNodes } from "../../../store/node/node.actions";
import { environment } from "../../../../environments/environment";
import { RemoteCategories } from "../../enums/remote-categories.enum";
import {
  retrievedIsConfiguratorConnect,
  retrievedIsHypervisorConnect,
  retrievedIsDatasourceConnect
} from "../../../store/server-connect/server-connect.actions";
import { ServerConnectService } from "../server-connect/server-connect.service";
import { retrievedProjects } from "../../../store/project/project.actions";
import { PortGroupService } from "../portgroup/portgroup.service";
import { ICON_PATH } from 'src/app/shared/contants/icon-path.constant';
import { AddUpdateGroupDialogComponent } from "../../../map/add-update-group-dialog/add-update-group-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';
import { CONFIG_TEMPLATE_ADDS_TYPE } from "../../../shared/contants/config-template-add-actions.constant";

@Injectable({
  providedIn: 'root'
})
export class HelpersService implements OnDestroy {
  selectMapOption$ = new Subscription();
  selectGroupBoxes$ = new Subscription();
  selectNodes$ = new Subscription();
  nodes: any[] = [];
  groupCategoryId!: string;
  errorMessages = ErrorMessages;
  isGroupBoxesChecked!: boolean;
  groupBoxes!: any[];
  lastWidth = 0;
  lastHeight = 0;
  zoomLimit = false;
  configTemplateAddsType = CONFIG_TEMPLATE_ADDS_TYPE;
  @Input() deletedInterfaces!: any[];
  @Input() deletedNodes!: any[];

  constructor(private store: Store,
    private toastr: ToastrService,
    private domSanitizer: DomSanitizer,
    private serverConnectionService: ServerConnectService,
    private portGroupService: PortGroupService,
    private dialog: MatDialog
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });
    this.selectGroupBoxes$ = this.store.select(selectGroupBoxes).subscribe((groupBoxes: any[]) => {
      this.groupBoxes = groupBoxes;
    });
    this.selectNodes$ = this.store.select(selectNodesByCollectionId).subscribe(nodes => this.nodes = nodes);
  }

  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectGroupBoxes$.unsubscribe();
    this.selectNodes$.unsubscribe();
  }

  optionDisplay(option: any) {
    return option && option.name ? option.name : '';
  }

  templateDisplay(option: any) {
    return option && option.display_name ? option.display_name : '';
  }

  hardwareDisplay(option: any) {
    return option && option.serial_number ? option.serial_number : '';
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
          "background-fit": "contain",
          "background-image-opacity": 1,
          "z-index": (ele: any) => ele.data('zIndex'),
          "z-compound-depth": "bottom",
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
          "text-opacity": 1,
          "curve-style": "bezier",
          "line-color": defaults.edge.color,
          "width": defaults.edge.size,
          "zIndex": 999,
          "z-compound-depth": "bottom",
          "text-margin-x": 20,
          "text-margin-y": -20,
          "text-rotation": "autorotate",
          "arrow-scale": 3,
          "control-point-step-size": 100,
        },
      },
      {
        selector: "edge[ip]",
        style: {
          "content": (ele: any) => ele.data('ip'),
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
        selector: "[?updated]",
        style: {
          'text-border-opacity': 1,
          'text-border-color': '#808080',
          'text-border-style': 'dashed',
          'text-border-width': 1,
        }
      },
      {
        selector: "[!updated]",
        style: {
          'text-border-opacity': 0,
        }
      }
    ]
  }

  addCYNode(cy: any, data: any) {
    return cy.add({
      group: "nodes",
      data: data.newNodeData,
      position: data.newNodePosition,
    });
  }

  addCYEdge(cy: any, data: any) {
    return cy.add({
      group: "edges",
      data,
    });
  }

  addCYNodeAndEdge(cy: any, nodes: any[], edges: any[], newPosition: any = { x: 0, y: 0 }, mapLinkId = undefined) {
    // Draw new nodes from the other project into the current project.
    nodes.map((node: any) => {
      if (node.data.elem_category == 'node' || node.data.elem_category == 'map_link') {
        node.data.icon = environment.apiBaseUrl + node.data.icon;
      }
      node.data.updated = true;
      let position = null;
      if (node.position) {
        position = { x: newPosition.x + node.position.x, y: newPosition.y + node.position.y }
      }
      const nodeEle = this.addCYNode(cy, { newNodeData: node.data, newNodePosition: position });
      if (mapLinkId) {
        nodeEle.move({ parent: `project-link-${mapLinkId}` });
      }
    })

    // Draw new interfaces from the other project into the current project.
    edges.map((edge: any) => {
      this.addCYEdge(cy, edge.data);
    })
  }

  removeGroupBoxes(cy: any) {
    const gbs = cy.nodes().filter('[label="group_box"]');
    gbs.forEach((gb: any) => {
      const data = gb.data();
      if (data.collapsedChildren) {
        cy.expandCollapse('get').expandRecursively(gb, {});
      }
      const gbNodes = gb.children();
      gbNodes.forEach((node: any) => {
        node.move({ 'parent': null });
      });
      cy.remove(gb);
    });
    const gbsTemplate = cy.nodes().filter(this.isGroupBoxCreatedFromCdnd)
    gbsTemplate.forEach((gb: any) => {
      this.removeParent(gb)
    })
    return true;
  }

  removeGroupBox(cy: any, groupBoxId: any) {
    const groupBox = cy.getElementById(`group-${groupBoxId}`)
    if (groupBox && groupBox.length > 0) {
      const data = groupBox.data();
      if (data.collapsedChildren) {
        cy.expandCollapse('get').expandRecursively(groupBox, {});
      }
      const gbNodes = groupBox.children();
      gbNodes.forEach((node: any) => {
        node.move({ 'parent': null });
      });
      cy.remove(groupBox);
    }
  }

  isGroupBoxCreatedFromCdnd(node: any) {
    return Object.values(node.classes()).includes('cdnd-new-parent')
  }

  addGroupBoxes(cy: any) {
    const gbs = this.groupBoxes.filter((gb: any) => gb.data.group_category == this.groupCategoryId);
    cy.add(gbs);
    cy.nodes().forEach((ele: any) => {
      if (!Boolean(ele.data('parent_id')) && ele.data('elem_category') != 'map_link') {
        const data = ele.data();
        if (data.elem_category != 'group') {
          const g = data.groups.filter((gb: any) => gb.category == this.groupCategoryId);
          if (g.length > 0) ele.move({ parent: 'group-' + g[0].id });
        }
      }
    });
    let done = false;
    for (let i = 0; i < gbs.length; i++) {
      let gb = gbs[i];
      const gbn = cy.getElementById(gb.data.id);
      if (gbn.children().length > 0) {
        if (gb.data.collapsed) {
          gb = cy.getElementById(gb.data.id);
          const pos = gbn.position();
          cy.expandCollapse('get').collapseRecursively(gbn, {});
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
        cy.remove(gbn);
      }
    }
    const z = cy.zoom();
    const cyW = cy.container().clientWidth;
    const cyH = cy.container().clientHeight;
    const nW = this.lastWidth || 100;
    const nH = this.lastHeight || 100;
    const lim = (nW * nH * z) / (cyW * cyH);
    this.zoomLimit = lim < 0.0005;
    cy.resize();
    return true;
  }

  reloadGroupBoxes(cy: any) {
    if (this.isGroupBoxesChecked) {
      this.removeGroupBoxes(cy);
      this.addGroupBoxes(cy);
    }
  }

  addNewGroupBoxByMovingNodes(cy: any, dropTarget: any, collectionId: any, mapCategory: string) {
    if (dropTarget.data() && dropTarget.hasClass('cdnd-new-parent')) {
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
            collection_id: collectionId,
            map_category: mapCategory
          };
          const dialog = this.dialog.open(AddUpdateGroupDialogComponent,
            { disableClose: true, width: '600px', autoFocus: false, data: dialogData }
          );
          dialog.afterClosed().subscribe((dialogResult: any) => {
            if (dialogResult && dialogResult.isCanceled) {
              if (nodes.length > 0 || portGroups.length > 0 || mapImages.length > 0) {
                this.removeParent(dropTarget)
              }
            }
          })
        }
        else {
          this.toastr.info('Two nodes belonged to a group box', 'Info')
          this.reloadGroupBoxes(cy);
        }
      }
    }
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
      mapLinkNode.data('new', false);
      mapLinkNode.data('updated', true);
      mapLinkNode.data('deleted', false);
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
      mapLinkNode.data('new', false);
      mapLinkNode.data('updated', true);
      mapLinkNode.data('deleted', false);
      mapLinkNode.data('collapsed', false);
      mapLinkNode.data('lastPos', mapLinkNode.position());
      mapLinkNode.style({
        'background-opacity': '.20',
        'background-color': '#00dcff',
        'background-image-opacity': 0,
      });
      this.randomPositionForElementsNoPosition(event.cy)
    })
  }

  randomPositionForElementsNoPosition(cy: any) {
    // Random position for the nodes if the map has layout preset however the nodes don't have the position
    const elementsNoPosition = cy.elements().filter((ele: any) =>
      (ele.group() == 'nodes' && ele.position('x') === 0 && ele.position('y') === 0)
    );
    if (elementsNoPosition.length > 0) {
      cy.elements().filter((ele: any) => (ele.position('x') !== 0 && ele.position('y') !== 0)).lock();
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

  getOptionByName(options: any, name: string) {
    const option = options?.filter((option: any) => option.name == name)[0];
    return option ? option : {};
  }

  setAutoCompleteValue(control: any, options: any, id: string) {
    if (id) {
      control.setValue(this.getOptionById(options, id));
    }
  }

  getAutoCompleteCtr(control: any, options: any) {
    if (typeof control?.value === 'string') {
      const option = this.getOptionByName(options, control?.value);
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
        const text = typeOfValue === 'string' ? value.toLowerCase() : value.name;
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
        const text = typeOfValue === 'string' ? value.toLowerCase() : value.name;
        const filteredOptions = options?.filter((option: any) => option['name']?.toLowerCase().includes(text)
          || option['subnet']?.toLowerCase().includes(text)
          || option['vlan']?.toString().toLowerCase().includes(text));
        return filteredOptions.length > 0 ? filteredOptions : options;
      }),
    );
  }

  removeNode(node: any) {
    node._private['data'] = { ...node._private['data'] };
    const data = node.data();
    if (!data.new) {
      data.deleted = true;
      if (data.elem_category == "port_group") {
        this.deletedNodes.push({
          'elem_category': data.elem_category,
          'label': data.label,
          'id': data.pg_id
        });
      } else if (data.elem_category == "node") {
        this.deletedNodes.push({
          'elem_category': data.elem_category,
          'label': data.label,
          'id': data.node_id
        });
      } else if (data.elem_category == "group") {
        this.deletedNodes.push({
          'elem_category': data.elem_category,
          'label': data.label,
          'id': data.group_id
        });
      } else if (data.elem_category == 'bg_image') {
        this.deletedNodes.push({
          'elem_category': data.elem_category,
          'label': data.label,
          'id': data.map_image_id
        })
      } else if (data.elem_category == 'map_link') {
        this.deletedNodes.push({
          'linked_project_id': data.linked_project_id,
          'elem_category': data.elem_category,
          'id': data.map_link_id
        });
      }

      node.edges().forEach((ele: any) => {
        const data = ele.data();
        if (data && !data.new) {
          data.deleted = true;
          this.deletedInterfaces.push({
            'name': data.id,
            'interface_id': data.interface_id
          });
        }
      });
    }
    return node.remove();
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

  restoreNode(node: any) {
    node._private['data'] = { ...node._private['data'] };
    var restored = node.restore();
    var node = null;
    restored.forEach((ele: any) => {
      var d = ele.data()
      if (ele.group() == 'nodes') {
        if (!d.new) {
          d.deleted = false;
          this.deletedNodes.pop();
          node = ele;
        }
      } else {
        if (!d.new) {
          d.deleted = false;
          this.deletedInterfaces.pop();
        }
      }
    });
    return node;
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

  removeInterface(ele: any, interface_id: number) {
    const interfaces = ele.data('interfaces').filter((i: any) => i.id != interface_id);
    ele.data('interfaces', interfaces);
  }

  removeEdge(data: any) {
    const edgeData = data.edge.data();
    const pg = data.cy.getElementById(`pg-${edgeData.port_group_id}`);
    const pg_interface = pg.data('interfaces').filter((i: any) => i.id == edgeData.interface_id)[0];
    this.removeInterface(pg, edgeData.interface_id);
    const node = data.cy.getElementById(`node-${edgeData.node_id}`);
    const node_interface = node.data('interfaces').filter((i: any) => i.id == edgeData.interface_id)[0];
    this.removeInterface(node, edgeData.interface_id);

    if (edgeData && !edgeData.new) {
      this.deletedInterfaces.push({
        'name': edgeData.id,
        'interface_id': edgeData.interface_id,
        'pg_interface_value': pg_interface.value,
        'node_interface_value': node_interface.value
      });
      edgeData.deleted = true;
    }
    this.store.dispatch(retrievedMapSelection({ data: true }));
    return { cy: data.cy, edge: data.edge.remove() };
  }

  restoreInterface(ele: any, interface_id: number) {
    const i = this.deletedInterfaces.filter((i: any) => i.interface_id == interface_id)[0];
    const interfaces = [...ele.data('interfaces'), {
      id: interface_id,
      value: ele.data('elem_category') == 'node' ? i.node_interface_value : i.pg_interface_value
    }];
    ele.data('interfaces', interfaces);
  }

  restoreEdge(data: any) {
    const edge_restore = data.edge.restore();
    const edgeData = edge_restore.data();
    const pg = data.cy.getElementById(`pg-${edgeData.port_group_id}`);
    this.restoreInterface(pg, edgeData.interface_id);
    const node = data.cy.getElementById(`node-${edgeData.node_id}`);
    this.restoreInterface(node, edgeData.interface_id);
    if (edgeData && !edgeData.new) {
      edgeData.deleted = false;
      this.deletedInterfaces.pop();
    }
    this.store.dispatch(retrievedMapSelection({ data: true }));
    return { cy: data.cy, edge: edge_restore };
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
    const typeOfValidation = validatieIP(params, newValue)
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

  updateNodesStorage(newNode: any) {
    const nodeIds = this.nodes.map(node => node.id);
    const newNodes = [...this.nodes];
    if (nodeIds.includes(newNode.id)) {
      const index = this.nodes.findIndex(node => node.id === newNode.id);
      newNodes.splice(index, 1, newNode);
      this.store.dispatch(retrievedNodes({ data: newNodes }));
    } else {
      this.store.dispatch(retrievedNodes({ data: newNodes.concat(newNode) }));
    }
  }

  updateNodeOnMap(cy: any, id: string, data: any) {
    const ele = cy.getElementById(id);
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
  }

  updatePGOnMap(cy: any, portGroupId: any, data: any) {
    const ele = cy.getElementById(`pg-${portGroupId}`);
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

  initCollapseExpandMapLink(cy: any) {
    // Add parent for the elements related to the map link
    const nodeRelatedMapLink = cy.elements().filter((ele: any) =>
      (ele.group() == 'nodes' && ele.data('parent_id'))
    )
    nodeRelatedMapLink.forEach((node: any) => {
      node.move({ parent: `project-link-${node.data('parent_id')}` });
    })

    // Set initial collapse and expand based on the project node data
    const mapLinkNodes = cy.nodes().filter((node: any) => node.data('elem_category') == 'map_link' && !Boolean(node.data('parent_id')))
    mapLinkNodes.map((mapLinkNode: any) => {
      if (mapLinkNode.data('collapsed')) {
        cy.expandCollapse('get').collapseRecursively(mapLinkNode, {});
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
  }

  removeNodesInStorage(nodeIds: any[]) {
    const newNodes = [...this.nodes];
    this.nodes.map(node => {
      if (nodeIds.includes(node.id)) {
        const index = newNodes.findIndex(ele => ele.id === node.id);
        newNodes.splice(index, 1);
      }
    })
    this.store.dispatch(retrievedNodes({ data: newNodes }));
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

  getConfigAddsTypeByDeviceCategory(deviceCategory: string) {
    switch (deviceCategory) {
      case 'Router': case 'Firewall':
        return this.configTemplateAddsType.filter(
          addType => addType.id == 'add_firewall_rule' || addType.id == 'add_route'
        )
      case 'Windows Server':
        return this.configTemplateAddsType.filter(
          addType => addType.id == 'add_roles_service' || addType.id == 'add_domain_membership'
        )
      case 'Windows Client': case 'Linux Client':
        return this.configTemplateAddsType.filter(addType => addType.id == 'add_domain_membership')
      default:
        return this.configTemplateAddsType
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

  updateProjectLinksStorage(cy: any, newProjects: any[]) {
    const projectNodeIdsAdded = cy?.nodes().filter('[elem_category="map_link"]').map((ele: any) => ele.data('linked_project_id'));
    projectNodeIdsAdded?.map((projectId: any) => {
      const index = newProjects.findIndex(ele => ele.id === projectId);
      newProjects.splice(index, 1);
    })
    this.store.dispatch(retrievedProjects({ data: newProjects }));
  }
}
