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

  restoreTextColor(data: any) {
    data.activeEles?.forEach((ele: any) => {
      ele.data("text_color", data.oldTextColor);
    });
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

  restoreTextSize(data: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_size", data.oldTextSize);
    });
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


  changeMapImageSize(data: any) {
    data.activeMBs?.forEach((ele: any) => {
      data.oldMapImageSize = ele.data("scale_image")
      data.oldMapImageWidth = ele.data("width")
      data.oldMapImageHeight = ele.data("height")
      if (ele.data("elem_category") === "bg_image") {
        const originalWidth = ele.data("original_width");
        const originalHeight = ele.data("original_height")
        ele.data('width', (data.newMapImageSize * originalWidth) / 100);
        ele.data('height', (data.newMapImageSize * originalHeight) / 100);
        ele.data('scale_image', data.newMapImageSize)
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    return data; 
  }

  restoreMapImageSize(data: any) {
    data.activeMBs.forEach((ele: any) => {
      if (ele.data("elem_category") === "bg_image") {
        ele.data("width", data.oldMapImageWidth);
        ele.data("height", data.oldMapImageHeight);
        ele.data('scale_image', data.oldMapImageSize);
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

  restorePGColor(data: any) {
    data.activePGs?.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("color", data.oldPGColor);
      }
    });
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

  restorePGSize(data: any) {
    data.activePGs.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("width", data.oldPGSize);
        ele.data("height", data.oldPGSize);
      }
    })
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

  restoreEdgeColor(data: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("color", data.oldEdgeColor);
    });
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

  restoreEdgeSize(data: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("width", data.oldEdgeSize);
    });
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

  restoreArrowScale(data: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("arrow_scale", data.oldArrowScale);
    });
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

  restoreTextBGColor(data: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_color", data.oldTextBGColor);
    });

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

  restoreTextBGOpacity (data: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_opacity", data.oldTextBGOpacity);
    })
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

  restoreGBOpacity(data: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("group_opacity", data.oldGBOpacity);
    })
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

  restoreGBColor(data: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("color", data.oldGBColor);
    });

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

  restoreGBBorderColor(data: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("border_color", data.oldGBBorderColor);
    });

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

  restoreGBType(data: any) {
    data.activeGBs.forEach((ele: any) => {
      ele.data("border_style", data.oldGBBorderType);
    });
    return data;
  }
}
