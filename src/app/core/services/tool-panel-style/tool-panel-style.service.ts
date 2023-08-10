import { Injectable, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Injectable({
  providedIn: 'root'
})
export class ToolPanelStyleService implements OnDestroy {
  @Input() ur: any;
  mapCategory = 'logical';
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();
  selectMapCategory$ = new Subscription();

  constructor(
    private store: Store
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }
  ngOnDestroy(): void {
    this.selectMapOption$.unsubscribe();
    this.selectMapCategory$.unsubscribe();
  }

  changTextColor(data: any) {
    data.selectedEles?.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id)
      data.oldTextColor = selectedEle.data("text_color");
      selectedEle._private['data'] = { ...selectedEle._private['data'] };
      if (selectedEle.data("label") == "map_background") {
        data.newColor = "#ffffff";
      } else {
        if (!selectedEle.data('label')) {
          const d = selectedEle.data();
          d.updated = true;
        }
      }
      selectedEle.data("text_color", data.newTextColor);
    })
    return data;
  }

  restoreTextColor(data: any) {
    data.selectedEles?.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id)
      selectedEle.data("text_color", data.oldTextColor);
    });
    return data
  }

  changeTextSize(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id)
      data.oldTextSize = selectedEle.data("text_size") ? selectedEle.data("text_size") : selectedEle.data().logical_map.map_style.text_size;
      selectedEle.data("text_size", data.newTextSize);
      if (!selectedEle.data('label')) {
        const d = selectedEle.data();
        d.updated = true;
      }
    })

    return data;
  }

  restoreTextSize(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id)
      selectedEle.data("text_size", data.oldTextSize);
    });
    return data;
  }

  changeNodeSize(data: any) {
    data.selectedNodes?.forEach((ele: any) => {
      const node = data.cy.getElementById(ele.data.id);
      data.oldNodeSize = node.data("width")
      if (ele.data.elem_category != "port_group" && ele.data?.label != "map_background") {
        node.data("width", data.newNodeSize);
        node.data("height", data.newNodeSize);
        const d = node.data();
        d.updated = true;
      }
    })
    return data;
  }

  restoreNodeSize(data: any) {
    data.selectedNodes.forEach((ele: any) => {
      const node = data.cy.getElementById(ele.data.id);
      if (ele.data.elem_category != "port_group" && ele.data?.label != "map_background") {
        node.data("width", data.oldNodeSize);
        node.data("height", data.oldNodeSize);
        const d = node.data();
        d.updated = true;
      }
    });
    return data;
  }


  changeMapImageSize(data: any) {
    data.selectedMapImages?.forEach((ele: any) => {
      const mapImage = data.cy.getElementById(ele.data.id);
      data.oldMapImageSize = mapImage.data("scale_image")
      data.oldMapImageWidth = mapImage.data("width")
      data.oldMapImageHeight = mapImage.data("height")
      if (mapImage.data("elem_category") === "bg_image") {
        const originalWidth = mapImage.data("original_width");
        const originalHeight = mapImage.data("original_height")
        mapImage.data('width', (data.newMapImageSize * originalWidth) / 100);
        mapImage.data('height', (data.newMapImageSize * originalHeight) / 100);
        mapImage.data('scale_image', data.newMapImageSize)
        const d = mapImage.data();
        d.updated = true;
      }
    })
    return data;
  }

  restoreMapImageSize(data: any) {
    data.selectedMapImages.forEach((ele: any) => {
      const mapImage = data.cy.getElementById(ele.data.id);
      if (mapImage.data("elem_category") === "bg_image") {
        mapImage.data("width", data.oldMapImageWidth);
        mapImage.data("height", data.oldMapImageHeight);
        mapImage.data('scale_image', data.oldMapImageSize);
        const d = mapImage.data();
        d.updated = true;
      }
    });
    return data;
  }

  changePGColor(data: any) {
    data.selectedPortGroups?.forEach((ele: any) => {
      const pg = data.cy.getElementById(ele.data.id);
      data.oldPGColor = pg.data("color");
      if (pg.data("elem_category") == "port_group") {
        pg.data("color", data.newPGColor);
        const d = pg.data();
        d.updated = true;
      }
    })
    return data;
  }

  restorePGColor(data: any) {
    data.selectedPortGroups?.forEach((ele: any) => {
      const pg = data.cy.getElementById(ele.data.id);
      if (pg.data("elem_category") == "port_group") {
        pg.data("color", data.oldPGColor);
      }
    });
    return data;
  }

  changePGSize(data: any) {
    data.selectedPortGroups.forEach((ele: any) => {
      const pg = data.cy.getElementById(ele.data.id);
      data.oldPGSize = pg.data("width")
      if (pg.data("elem_category") == "port_group") {
        pg.data("width", data.newPGSize);
        pg.data("height", data.newPGSize);
        pg.style({ "background-fit": "cover" });
        const d = pg.data();
        d.updated = true;
      }
    })
    return data;
  }

  restorePGSize(data: any) {
    data.selectedPortGroups.forEach((ele: any) => {
      const pg = data.cy.getElementById(ele.data.id);
      if (pg.data("elem_category") == "port_group") {
        pg.data("width", data.oldPGSize);
        pg.data("height", data.oldPGSize);
      }
    })
    return data;
  }

  changeEdgeColor(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      data.oldEdgeColor = edge.data("color") ? edge.data("color") : edge.data().logical_map.map_style.color;
      edge.data("color", data.newEdgeColor);
      const d = edge.data();
      d.updated = true;
    });
    return data;
  }

  restoreEdgeColor(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      edge.data("color", data.oldEdgeColor);
    });
    return data;
  }

  changeEdgeSize(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      data.oldEdgeSize = edge.data("width") ? edge.data("width") : edge.data().logical_map.map_style.width;
      edge.data("width", data.newEdgeSize);
      const d = edge.data();
      d.updated = true;
    })
    return data;
  }

  restoreEdgeSize(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      edge.data("width", data.oldEdgeSize);
    });
    return data;
  }

  changeArrowScale(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      data.oldArrowScale = edge.data("arrow_scale");
      edge.data("arrow_scale", data.newArrowScale);
      const d = edge.data();
      d.updated = true;
    })
    return data;
  }

  restoreArrowScale(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const edge = data.cy.getElementById(ele.data.id);
      edge.data("arrow_scale", data.oldArrowScale);
    });
    return data;
  }

  changeDirection(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const interfaces = data.cy.getElementById(ele.data.id)
      data.oldDirection = interfaces.data("direction")
      interfaces.data("direction", data.newDirection);
      const d = interfaces.data();
      d.updated = true;
    })
    return data;
  }

  restoreDirection(data: any) {
    data.selectedInterfaces.forEach((ele: any) => {
      const interfaces = data.cy.getElementById(ele.data.id)
      interfaces.data("direction", data.oldDirection);
    })
    return data;
  }

  changeTextBGColor(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const interfaces = data.cy.getElementById(ele.data.id)
      data.oldTextBGColor = interfaces.data("text_bg_color") ? interfaces.data("text_bg_color") : interfaces.data().logical_map.map_style.text_bg_color;
      interfaces._private['data'] = { ...interfaces._private['data'] };
      interfaces.data("text_bg_color", data.newTextBGColor);
      const d = interfaces.data();
      d.updated = true;
    });
    return data;
  }

  restoreTextBGColor(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const interfaces = data.cy.getElementById(ele.data.id)
      interfaces.data("text_bg_color", data.oldTextBGColor);
    });

    return data;
  }

  changeTextBGOpacity(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      data.oldTextBGOpacity = selectedEle.data("text_bg_opacity");
      selectedEle.data("text_bg_opacity", data.newTextBGOpacity);
      const d = selectedEle.data();
      d.updated = true;
    })
    return data;
  }

  restoreTextBGOpacity(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      selectedEle.data("text_bg_opacity", data.oldTextBGOpacity);
    })
    return data;
  }

  changeTextOutlineColor(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      data.oldTextOutlineColor = selectedEle.data("text_outline_color");
      selectedEle._private['data'] = { ...selectedEle._private['data'] };
      selectedEle.data("text_outline_color", data.newTextOutlineColor);
      const d = selectedEle.data();
      d.updated = true;
    });
    return data;
  }

  restoreTextOutlineColor(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      selectedEle.data("text_outline_color", data.oldTextOutlineColor);
    });

    return data;
  }

  changeTextOutlineWidth(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      data.oldTextOutlineWidth = selectedEle.data("text_outline_width");
      selectedEle.data("text_outline_width", data.newTextOutlineWidth);
      const d = selectedEle.data();
      d.updated = true;
    })
    return data;
  }

  restoreTextOutlineWidth(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const selectedEle = data.cy.getElementById(ele.data.id);
      selectedEle.data("text_outline_width", data.oldTextOutlineWidth);
    })
    return data;
  }

  changeTextVAlign(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const eles = data.cy.getElementById(ele.data.id);
      data.oldTextVAlign = eles.data("text_valign");
      eles.data("text_valign", data.newTextVAlign);
      const d = eles.data();
      d.updated = true;
    })
    return data;
  }

  restoreTextVAlign(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const eles = data.cy.getElementById(ele.data.id);
      eles.data("text_valign", data.oldTextVAlign);
    });
    return data;
  }

  changeTextHAlign(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const eles = data.cy.getElementById(ele.data.id);
      data.oldTextHAlign = eles.data("text_halign");
      eles.data("text_halign", data.newTextHAlign);
      const d = eles.data();
      d.updated = true;
    })
    return data;
  }

  restoreTextHAlign(data: any) {
    data.selectedEles.forEach((ele: any) => {
      const eles = data.cy.getElementById(ele.data.id);
      eles.data("text_halign", data.oldTextHAlign);
    })
    return data;
  }

  changeGBOpacity(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const group = data.cy.getElementById(ele.data.id);
      data.oldGBOpacity = group.data("group_opacity");
      group._private['data'] = { ...group._private['data'] };
      group.data("group_opacity", data.newGBOpacity);
      const d = group.data();
      d.updated = true;
    })
    return data;
  }

  restoreGBOpacity(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const group = data.cy.getElementById(ele.data.id);
      group.data("group_opacity", data.oldGBOpacity);
    })
    return data;
  }

  changeGBColor(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      data.oldGBColor = gb.data("color");
      gb._private['data'] = { ...gb._private['data'] };
      gb.data("color", data.newGBColor);
      const d = gb.data();
      d.updated = true;
    });

    return data;
  }

  restoreGBColor(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      gb.data("color", data.oldGBColor);
    });

    return data;
  }

  changeGBBorderColor(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      data.oldGBBorderColor = gb.data("border_color");
      gb._private['data'] = { ...gb._private['data'] };
      gb.data("border_color", data.newGBBorderColor);
      const d = gb.data();
      d.updated = true;
    })

    return data;
  }

  restoreGBBorderColor(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      gb.data("border_color", data.oldGBBorderColor);
    });

    return data;
  }

  changeGBType(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      data.oldGBBorderType = gb.data("border_style");
      gb._private['data'] = { ...gb._private['data'] };
      gb.data("border_style", data.newGBBorderType);
      const d = gb.data();
      d.updated = true;
    })
    return data;
  }

  restoreGBType(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      gb.data("border_style", data.oldGBBorderType);
    });
    return data;
  }

  changeGBBorderSize(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      data.oldGBBorderSize = gb.data("border_width");
      gb._private['data'] = { ...gb._private['data'] };
      gb.data("border_width", data.newGBBorderSize);
      const d = gb.data();
      d.updated = true;
    })
    return data;
  }

  restoreGBBorderSize(data: any) {
    data.selectedGroups.forEach((ele: any) => {
      const gb = data.cy.getElementById(ele.data.id);
      gb.data("border_width", data.oldGBBorderSize);
    });
    return data;
  }
}
