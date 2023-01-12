import { Store } from '@ngrx/store';
import { map, startWith, Subscription } from 'rxjs';
import { Injectable, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { selectGroupBoxes } from 'src/app/store/map/map.selectors';
import { FormControl, FormGroup } from '@angular/forms';
import { validatieIP } from 'src/app/shared/validations/ip-subnet.validation.ag-grid';
import { ErrorMessages } from 'src/app/shared/enums/error-messages.enum';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  selectMapOption$ = new Subscription();
  selectGroupBoxes$ = new Subscription();
  groupCategoryId!: string;
  errorMessages = ErrorMessages;
  isGroupBoxesChecked!: boolean;
  groupBoxes!: any[];
  lastWidth = 0;
  lastHeight = 0;
  zoomLimit = false;
  @Input() deletedInterfaces!: any[];
  @Input() deletedNodes!: any[];

  constructor(private store: Store,
              private toastr: ToastrService,
              private domSanitizer: DomSanitizer) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
        this.groupCategoryId = mapOption.groupCategoryId;
      }
    });
    this.selectGroupBoxes$ = this.store.select(selectGroupBoxes).subscribe((groupBoxes: any[]) => {
      this.groupBoxes = groupBoxes;
    });
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
          'background-opacity': (ele: any) => ele.data('group_opacity'),
          'background-color': (ele: any) => ele.data('color'),
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
          'background-color': (ele: any) => ele.data('color'),
          'background-opacity': (ele: any) => ele.data('group_opacity'),
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
          "zIndex": 999,
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

  addGroupBoxes(cy: any) {
    const gbs = this.groupBoxes.filter((gb: any) => gb.data.group_category == this.groupCategoryId);
    cy.add(gbs);
    cy.nodes().forEach((ele: any) => {
      const data = ele.data();
      if (data.elem_category != 'group') {
        const g = data.groups.filter((gb: any) => gb.category == this.groupCategoryId);
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

  createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
        const text = typeof value === 'string' ? value.toLowerCase() : value.name;
        const filteredOptions =  options?.filter((option: any) => option[optionColumn]?.toLowerCase().includes(text));
        return filteredOptions.length > 0 ? filteredOptions : options;
      }),
    );
  }

  removeNode(node: any) {
    node._private['data'] = {...node._private['data']};
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
    // this._info_panel.remove_row(data.id);
    return node.remove();
  }

  restoreNode(node: any){
    node._private['data'] = {...node._private['data']};
    var restored = node.restore();
    var node = null;
    restored.forEach((ele: any) => {
        var d = ele.data()
        if(ele.group() == 'nodes'){
            if (!d.new) {
                d.deleted = false;
                this.deletedNodes.pop();
                node = ele;
            }
        }else{
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

  removeEdge(edge: any) {
    const data = edge.data();
    if (data && !data.new) {
      this.deletedInterfaces.push({
        'name': data.id,
        'interface_id': data.interface_id
      });
      data.deleted = true;
    }
    return edge.remove();
  }

  restoreEdge(edge: any) {
    const edge_restore = edge.restore();
    const data = edge_restore.data();
    if (data && !data.new) {
      data.deleted = false;
      this.deletedInterfaces.pop();
    }
    return edge_restore;
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
}
