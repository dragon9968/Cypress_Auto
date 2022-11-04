import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Injectable({
  providedIn: 'root'
})
export class ToolPanelStyleService {
  @Input() ur: any;
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  constructor(
    private store: Store,
    private helpers: HelpersService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  changTextColor(data: any) {
    data.activeEles?.forEach((ele : any) => {
      data.oldTextColor = ele.data("text_color");
      ele._private['data'] = {...ele._private['data']};
      if (ele.data("label") == "map_background") {
        data.newColor = "#ffffff";
      } else {
        if (!ele.data('label')) {
          const d = ele.data();
          if (!d.new) {
            d.updated = true;
          }
        }
      }
      ele.data("text_color", data.newTextColor);
    })
    return data;
  }

  restoreTextColor(data: any, textColor: any) {
    data.activeEles?.forEach((ele: any) => {
      ele.data("text_color", data.oldTextColor);
    });
    textColor = this.helpers.fullColorHex(data?.oldTextColor);
    return data
  }

  changeTextSize(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.oldTextSize = ele.data("text_size");
      ele.data("text_size", data.newTextSize);
      if (!ele.data('label')) {
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })

    return data;
  }

  restoreTextSize(data: any, textSize: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_size", data.oldTextSize);
    });
    textSize = data.oldTextSize <= 200 ? data.oldTextSize : 200;
    return data;
  }

  changeNodeSize(data: any) {
    data.activeNodes?.forEach((ele: any) => {
      data.oldNodeSize = ele.data("width")
      if (ele.data("elem_category") != "port_group" && ele.data("label") != "map_background") {
        ele.data("width", data.newNodeSize);
        ele.data("height", data.newNodeSize);
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    return data;
  }

  restoreNodeSize(data: any) {
    data.activeNodes.forEach((ele: any) => {
      if (ele.data("elem_category") != "port_group" && ele.data("label") != "map_background") {
        ele.data("width", data.oldNodeSize);
        ele.data("height", data.oldNodeSize);
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    });
    return data;
  }

  changePGColor(data: any) {
    data.activePGs?.forEach((ele: any) => {
      data.oldPGColor = ele.data("color");
      if (ele.data("elem_category") == "port_group") {
        ele.data("color", data.newPGColor);
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    return data;
  }

  restorePGColor(data: any, pgColor: any) {
    data.activePGs?.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("color", data.oldPGColor);
      }
    });
    pgColor = this.helpers.fullColorHex(data.oldPGColor);
    return data;
  }

  changePGSize(data: any) {
    data.activePGs.forEach((ele: any) => {
      data.oldPGSize = ele.data("width")
      if (ele.data("elem_category") == "port_group") {
        ele.data("width", data.newPGSize);
        ele.data("height", data.newPGSize);
        ele.style({ "background-fit": "cover" });
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    return data;
  }

  restorePGSize(data: any, pgSize: any) {
    data.activePGs.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("width", data.oldPGSize);
        ele.data("height", data.oldPGSize);
      }
    })
    pgSize = data.oldPGSize <= 200 ? data.oldPGSize : 200;
    return data;
  }

  changeEdgeColor(data: any) {
    data.activeEdges.forEach((ele: any) => {
      data.oldEdgeColor = ele.data("color")
      ele.data("color", data.newEdgeColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });
    return data;
  }

  restoreEdgeColor(data: any, edgeColor: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("color", data.oldEdgeColor);
    });
    edgeColor = this.helpers.fullColorHex(data.oldEdgeColor);
    return data;
  }

  changeEdgeSize(data: any) {
    data.activeEdges.forEach((ele: any) => {
      data.oldEdgeSize = ele.data("width");
      ele.data("width", data.newEdgeSize);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreEdgeSize(data: any, edgeSize: number) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("width", data.oldEdgeSize);
    });
    edgeSize = data.oldEdgeSize <= 50 ? data.oldEdgeSize : 50;
    return data;
  }

  changeArrowScale(data: any) {
    data.activeEdges.forEach((ele: any) => {
      data.oldArrowScale = ele.data("arrow_scale");
      ele.data("arrow_scale", data.newArrowScale);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreArrowScale(data: any, arrowSize: number) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("arrow_scale", data.oldArrowScale);
    });
    arrowSize = data.oldArrowScale <= 200 ? data.oldArrowScale : 200;
    return data;
  }

  changeDirection(data: any) {
    data.activeEdges.forEach((ele: any) => {
      data.oldDirection = ele.data("direction")
      ele.data("direction", data.newDirection);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreDirection(data: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("direction", data.oldDirection);
    })
    return data;
  }

  changeTextBGColor(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.oldTextBGColor = ele.data("text_bg_color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("text_bg_color", data.newTextBGColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });
    return data;
  }

  restoreTextBGColor(data: any, textBGColor: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_color", data.oldTextBGColor);
    });

    textBGColor = this.helpers.fullColorHex(data.oldTextBGColor);
    return data;
  }

  changeTextBGOpacity(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.oldTextBGOpacity = ele.data("text_bg_opacity");
      ele.data("text_bg_opacity", data.newTextBGOpacity);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreTextBGOpacity (data: any, textBGOpacity: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_opacity", data.oldTextBGOpacity);
    })
    textBGOpacity = data.oldTextBGOpacity;
    return data;
  }

  changeTextVAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.oldTextVAlign = ele.data("text_valign");
      ele.data("text_valign", data.newTextVAlign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreTextVAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_valign", data.oldTextVAlign);
    });
    return data;
  }

  changeTextHAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.oldTextHAlign = ele.data("text_halign");
      ele.data("text_halign", data.newTextHAlign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreTextHAlign(data: any){
    data.activeEles.forEach((ele: any) => {
      ele.data("text_halign", data.oldTextHAlign);
    })
    return data;
  }

  changeGBOpacity(data: any) {
    data.activeGBs.forEach((ele: any) => {
      data.oldGBOpacity = ele.data("group_opacity");
      ele._private['data'] = {...ele._private['data']};
      ele.data("group_opacity", data.newGBOpacity);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreGBOpacity(data: any, gbOpacity: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("group_opacity", data.oldGBOpacity);
    })
    gbOpacity = data.oldGBOpacity;
    return data;
  }

  changeGBColor(data: any) {
    data.activeGBs.forEach((ele: any) => {
      data.oldGBColor = ele.data("color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("color", data.newGBColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });

    return data;
  }

  restoreGBColor(data: any, gbColor: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("color", data.oldGBColor);
    });

    gbColor = this.helpers.fullColorHex(data.oldGBColor);
    return data;
  }

  changeGBBorderColor(data: any) {
    data.activeGBs.forEach((ele: any) => {
      data.oldGBBorderColor = ele.data("border_color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("border_color", data.newGBBorderColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })

    return data;
  }

  restoreGBBorderColor(data: any, gbBorderColor: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("border_color", data.oldGBBorderColor);
    });

    gbBorderColor = this.helpers.fullColorHex(data.oldGBBorderColor);
    return data;
  }

  changeGBType(data: any) {
    data.activeGBs.forEach((ele: any) => {
      data.oldGBBorderType = ele.data("border_style");
      ele._private['data'] = {...ele._private['data']};
      ele.data("border_style", data.newGBBorderType);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreGBType(data: any, gbBorderTypeActivated: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("border_style", data.oldGBBorderType);
    });
    gbBorderTypeActivated = data.oldGBBorderType;
    return data;
  }
}
