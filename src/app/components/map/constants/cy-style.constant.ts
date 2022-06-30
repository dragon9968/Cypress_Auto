import { Stylesheet } from "cytoscape";

export function generateCyStyle(defaults: any): Stylesheet[] {
  return [
    {
      selector: "node",
      style: {
        "content": function(ele: any){ return ele.data('name') },
        "text-wrap": "wrap",
        "text-opacity": 1,
        "color": defaults.text.color,
        "font-size": defaults.text.size,
        "font-style": "normal",
        "text-valign": "bottom",
        "text-halign": "center",
        "background-fit": "contain",
        "background-image-opacity": 1,
        "z-index": function(ele: any){ return ele.data('zIndex') },
        "z-compound-depth": "bottom",
      },
    },
    {
      selector: '[text_color]',
      style: {
        'color': function(ele: any){ return ele.data('text_color') },
      }
    },
    {
      selector: '[text_size]',
      style: {
        'font-size': function(ele: any){ return ele.data('text_size') },
      }
    },
    {
      selector: '[text_bg_color]',
      style: {
        'text-background-color': function(ele: any){ return ele.data('text_bg_color') },
      }
    },
    {
      selector: '[text_bg_opacity]',
      style: {
        'text-background-opacity': function(ele: any){ return ele.data('text_bg_opacity') },
      }
    },
    {
      selector: '[text_valign]',
      style: {
        'text-valign': function(ele: any){ return ele.data('text_valign') },
      }
    },
    {
      selector: '[text_halign]',
      style: {
        'text-halign': function(ele: any){ return ele.data('text_halign') },
      }
    },
    {
      selector: '[border_color]',
      style: {
        'border-color': function(ele: any){ return ele.data('border_color') },
      }
    },
    {
      selector: '[border_style]',
      style: {
        'border-style': function(ele: any){ return ele.data('border_style') },
      }
    },
    {
      selector: 'node[width][height]',
      style: {
        "height": function(ele: any){ return ele.data('height') },
        "width": function(ele: any){ return ele.data('width') },
      }
    },
    {
      selector: '[icon]',
      style: {
        "background-opacity": 0,
        'background-color': '#ffffff',
        "background-image": function(ele: any){ return ele.data('icon') },
        'shape': "roundrectangle",
      }
    },
    {
      selector: 'node[color]',
      style: {
        "background-color": function(ele: any){ return ele.data('color') },
      }
    },
    {
      selector: '[font_weight]',
      style: {
        "font-weight": function(ele: any){ return ele.data('font_weight') },
      }
    },
    {
      selector: 'node[packet]',
      style: {
        "shape": function(ele: any){ return ele.data('shape') },
        "background-color": function(ele: any){ return ele.data('color') },
        'text-opacity' : 0
      }
    },
    {
      selector: '[elem_category="port_group"]',
      style: {
        'shape': "ellipse",
        "background-opacity": 1,
        'content': function(ele: any){ return ele.data('subnet') },
      }
    },
    {
      selector: '[label="map_background"]',
      style: {
        'shape': "roundrectangle",
        "background-opacity": 1,
        "background-image": function(ele: any){ return ele.data('src') },
        "background-fit": "contain",
        "text-opacity": 0,
        "z-index-compare": "manual",
        'content': function(ele: any){ return ele.data('id') },
      }
    },
    {
      selector: ':parent',
      style: {
        'content': function(ele: any){ return ele.data('name') },
        'background-opacity': function(ele: any){ return ele.data('group_opacity') },
        'background-color': function(ele: any){ return ele.data('color') },
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
        'content': function(ele: any){ return ele.data('id') },
        'background-color': function(ele: any){ return ele.data('color') },
        'background-opacity': function(ele: any){ return ele.data('group_opacity') },
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
        "content": function(ele: any){ return ele.data('ip') },
      },
    },
    {
      selector: "edge[color]",
      style: {
        "line-color": function(ele: any){ return ele.data('color') },
      },
    },
    {
      selector: "edge[curve_style]",
      style: {
        "curve-style": function(ele: any){ return ele.data('curve_style') },
      },
    },
    {
      selector: "edge[width]",
      style: {
        "width": function(ele: any){ return ele.data('width') },
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
        "arrow-scale": function(ele: any){ return ele.data('arrow_scale') },
      },
    },
    {
      selector: "[ip_last_octet]",
      style: {
        "content": function(ele: any){ return ele.data('ip_last_octet') },
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
        "target-arrow-color": function(ele: any){ return ele.data('color') },
        "source-arrow-color": function(ele: any){ return ele.data('color') },
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
        "source-arrow-color": function(ele: any){ return ele.data('color') },
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
        "target-arrow-color": function(ele: any){ return ele.data('color') },
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