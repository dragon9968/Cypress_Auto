import { Injectable } from '@angular/core';
import { Stylesheet } from 'cytoscape';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  last_width = 0;
  last_height = 0;
  zoom_limit = false;

  constructor() { }

  optionDisplay(option: any) {
    return option && option.name ? option.name : '';
  }

  templateDisplay(option: any) {
    return option && option.display_name ? option.display_name : '';
  }

  hardwareDisplay(option: any) {
    return option && option.serial_number ? option.serial_number : '';
  }

  generateCyStyle(defaults: any): Stylesheet[] {
    return [
      {
        selector: "node",
        style: {
          "content": function (ele: any) { return ele.data('name') },
          "text-wrap": "wrap",
          "text-opacity": 1,
          "color": defaults.text.color,
          "font-size": defaults.text.size,
          "font-style": "normal",
          "text-valign": "bottom",
          "text-halign": "center",
          "background-fit": "contain",
          "background-image-opacity": 1,
          "z-index": function (ele: any) { return ele.data('zIndex') },
          "z-compound-depth": "bottom",
        },
      },
      {
        selector: '[text_color]',
        style: {
          'color': function (ele: any) { return ele.data('text_color') },
        }
      },
      {
        selector: '[text_size]',
        style: {
          'font-size': function (ele: any) { return ele.data('text_size') },
        }
      },
      {
        selector: '[text_bg_color]',
        style: {
          'text-background-color': function (ele: any) { return ele.data('text_bg_color') },
        }
      },
      {
        selector: '[text_bg_opacity]',
        style: {
          'text-background-opacity': function (ele: any) { return ele.data('text_bg_opacity') },
        }
      },
      {
        selector: '[text_valign]',
        style: {
          'text-valign': function (ele: any) { return ele.data('text_valign') },
        }
      },
      {
        selector: '[text_halign]',
        style: {
          'text-halign': function (ele: any) { return ele.data('text_halign') },
        }
      },
      {
        selector: '[border_color]',
        style: {
          'border-color': function (ele: any) { return ele.data('border_color') },
        }
      },
      {
        selector: '[border_style]',
        style: {
          'border-style': function (ele: any) { return ele.data('border_style') },
        }
      },
      {
        selector: 'node[width][height]',
        style: {
          "height": function (ele: any) { return ele.data('height') },
          "width": function (ele: any) { return ele.data('width') },
        }
      },
      {
        selector: '[icon]',
        style: {
          "background-opacity": 0,
          'background-color': '#ffffff',
          "background-image": function (ele: any) { return ele.data('icon') },
          'shape': "roundrectangle",
        }
      },
      {
        selector: 'node[color]',
        style: {
          "background-color": function (ele: any) { return ele.data('color') },
        }
      },
      {
        selector: '[font_weight]',
        style: {
          "font-weight": function (ele: any) { return ele.data('font_weight') },
        }
      },
      {
        selector: 'node[packet]',
        style: {
          "shape": function (ele: any) { return ele.data('shape') },
          "background-color": function (ele: any) { return ele.data('color') },
          'text-opacity': 0
        }
      },
      {
        selector: '[elem_category="port_group"]',
        style: {
          'shape': "ellipse",
          "background-opacity": 1,
          'content': function (ele: any) { return ele.data('subnet') },
        }
      },
      {
        selector: '[label="map_background"]',
        style: {
          'shape': "roundrectangle",
          "background-opacity": 1,
          "background-image": function (ele: any) { return ele.data('src') },
          "background-fit": "contain",
          "text-opacity": 0,
          "z-index-compare": "manual",
          'content': function (ele: any) { return ele.data('id') },
        }
      },
      {
        selector: ':parent',
        style: {
          'content': function (ele: any) { return ele.data('name') },
          'background-opacity': function (ele: any) { return ele.data('group_opacity') },
          'background-color': function (ele: any) { return ele.data('color') },
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
          'content': function (ele: any) { return ele.data('id') },
          'background-color': function (ele: any) { return ele.data('color') },
          'background-opacity': function (ele: any) { return ele.data('group_opacity') },
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
          "curve-style": "straight",
          "line-color": defaults.edge.color,
          "width": defaults.edge.size,
          "z-compound-depth": "bottom",
          "text-margin-x": 20,
          "text-margin-y": -20,
          "text-rotation": "autorotate",
          "arrow-scale": 3
        },
      },
      {
        selector: "edge[ip]",
        style: {
          "content": function (ele: any) { return ele.data('ip') },
        },
      },
      {
        selector: "edge[color]",
        style: {
          "line-color": function (ele: any) { return ele.data('color') },
        },
      },
      {
        selector: "edge[curve_style]",
        style: {
          "curve-style": function (ele: any) { return ele.data('curve_style') },
        },
      },
      {
        selector: "edge[width]",
        style: {
          "width": function (ele: any) { return ele.data('width') },
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
        selector: "[arrow_scale]",
        style: {
          "arrow-scale": function (ele: any) { return ele.data('arrow_scale') },
        },
      },
      {
        selector: "[ip_last_octet]",
        style: {
          "content": function (ele: any) { return ele.data('ip_last_octet') },
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
          "target-arrow-color": function (ele: any) { return ele.data('color') },
          "source-arrow-color": function (ele: any) { return ele.data('color') },
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
          "source-arrow-color": function (ele: any) { return ele.data('color') },
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
          "target-arrow-color": function (ele: any) { return ele.data('color') },
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
      data: data.newNodeData,
    });
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
    return true;
  }

  addGroupBoxes(cy: any, groupBoxes: any, groupCategory: string) {
    const gbs = groupBoxes.filter((gb: any) => gb.data.group_category == groupCategory);
    cy.add(gbs);
    cy.nodes().forEach((ele: any) => {
      const data = ele.data();
      if (data.elem_category != 'group') {
        const g = data.groups.filter((gb: any) => gb.category == groupCategory);
        if (g.length > 0) ele.move({ parent: 'group-' + g[0].id });
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
            this.last_width = 90;
            this.last_height = 90;
          }

        } else {
          this.last_width = gbn.renderedWidth()
          this.last_height = gbn.renderedHeight()
        }
        if (gb.data.locked) {
          gbn.lock()
        }
      } else {
        cy.remove(gbn)
      }
    }
    const z = cy.zoom()
    const cyW = cy.container().clientWidth
    const cyH = cy.container().clientHeight
    const nW = this.last_width || 100
    const nH = this.last_height || 100
    const lim = (nW * nH * z) / (cyW * cyH)
    this.zoom_limit = lim < 0.0005
    cy.resize();
    return true;
  }

  reloadGroupBoxes(cy: any, groupBoxes: any, groupCategory: string, isGroupBoxesChecked: boolean) {
    if (isGroupBoxesChecked) {
      this.removeGroupBoxes(cy);
      this.addGroupBoxes(cy, groupBoxes, groupCategory);
    }
  }

  createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getOptionById(options: any, id: string) {
    return options?.filter((option: any) => option.id == id)[0];
  }
}
