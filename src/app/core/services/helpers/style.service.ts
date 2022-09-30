import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
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

  changTextColor(data: any, textColor: any) {
    data.activeEles?.forEach((ele : any) => {
      data.old_text_color = ele.data("text_color");
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
      ele.data("text_color", data.newColor);
    })
    textColor = this.helpers.fullColorHex(data?.newColor);
    return data;
  }

  restoreTextColor(data: any, textColor: any) {
    data.activeEles?.forEach((ele: any) => {
      ele.data("text_color", data.old_text_color);
    });
    textColor = this.helpers.fullColorHex(data?.old_text_color);
    return data
  }

  changeTextSize(data: any, textSize: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_size = ele.data("text_size");
      ele.data("text_size", data.newTextSize);
      if (!ele.data('label')) {
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    textSize = data.newTextSize <= 200 ? data.newTextSize : 200;
    return data;
  }

  restoreTextSize(data: any, textSize: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_size", data.old_text_size);
    });
    textSize = data.old_text_size <= 200 ? data.old_text_size : 200;
    return data;
  }

  changePGColor(data: any, pgColor: any) {
    data.activePGs?.forEach((ele: any) => {
      data.old_pg_color = ele.data("color");
      if (ele.data("elem_category") == "port_group") {
        ele.data("color", data.newPgColor);
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })

    pgColor = this.helpers.fullColorHex(data.newPgColor);
    return data;
  }

  restorePGColor(data: any, pgColor: any) {
    data.activePGs?.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("color", data.old_pg_color);
      }
    });
    pgColor = this.helpers.fullColorHex(data.old_pg_color);
    return data;
  }

  changePGSize(data: any, pgSize: any) {
    data.activePgs.forEach((ele: any) => {
      data.old_pg_size = ele.data("width")
      if (ele.data("elem_category") == "port_group") {
        ele.data("width", data.newPgSize);
        ele.data("height", data.newPgSize);
        ele.style({ "background-fit": "cover" });
        const d = ele.data();
        if (!d.new) {
          d.updated = true;
        }
      }
    })
    pgSize = data.newPgSize <= 200 ? data.newPgSize : 200;
    return data;
  }

  restorePGSize(data: any, pgSize: any) {
    data.activePgs.forEach((ele: any) => {
      if (ele.data("elem_category") == "port_group") {
        ele.data("width", data.old_pg_size);
        ele.data("height", data.old_pg_size);
      }
    })
    pgSize = data.old_pg_size <= 200 ? data.old_pg_size : 200;
    return data;
  }

  changeEdgeColor(data: any, edgeColor: any) {
    data.activeEdges.forEach((ele: any) => {
      data.old_edge_color = ele.data("color")
      ele.data("color", data.newEdgeColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });
    edgeColor = this.helpers.fullColorHex(data.newEdgeColor);
    return data;
  }

  restoreEdgeColor(data: any, edgeColor: any) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("color", data.old_edge_color);
    });
    edgeColor = this.helpers.fullColorHex(data.old_edge_color);
    return data;
  }

  changeEdgeSize(data: any, edgeSize: number) {
    data.activeEdges.forEach((ele: any) => {
      data.old_edge_size = ele.data("width");
      ele.data("width", data.newEdgeSize);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    edgeSize = data.newEdgeSize <= 50 ? data.newEdgeSize : 50;
    return data;
  }

  restoreEdgeSize(data: any, edgeSize: number) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("width", data.old_edge_size);
    });
    edgeSize = data.old_edge_size <= 50 ? data.old_edge_size : 50;
    return data;
  }

  changeArrowScale(data: any, arrowSize: number) {
    data.activeEdges.forEach((ele: any) => {
      data.old_arrow_scale = ele.data("arrow_scale");
      ele.data("arrow_scale", data.newArrowScale);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    arrowSize = data.newArrowScale <= 200 ? data.newArrowScale : 200;
    return data;
  }

  restoreArrowScale(data: any, arrowSize: number) {
    data.activeEdges.forEach((ele: any) => {
      ele.data("arrow_scale", data.old_arrow_scale);
    });
    arrowSize = data.old_arrow_scale <= 200 ? data.old_arrow_scale : 200;
    return data;
  }

  changeDirection(data: any) {
    data.activeEdges.forEach((ele: any) => {
      data.old_direction = ele.data("direction")
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
      ele.data("direction", data.old_direction);
    })
    return data;
  }

  changeTextBGColor(data: any, textBGColor: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_bg_color = ele.data("text_bg_color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("text_bg_color", data.newColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });

    textBGColor = this.helpers.fullColorHex(data.newColor);
    return data;
  }

  restoreTextBGColor(data: any, textBGColor: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_color", data.old_text_bg_color);
    });

    textBGColor = this.helpers.fullColorHex(data.old_text_bg_color);
    return data;
  }

  changeTextBGOpacity(data: any, textBGOpacity: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_bg_opacity = ele.data("text_bg_opacity");
      ele.data("text_bg_opacity", data.newTextBgOpacity);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    textBGOpacity = data.newTextBgOpacity;
    return data;
  }

  restoreTextBGOpacity (data: any, textBGOpacity: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_bg_opacity", data.old_text_bg_opacity);
    })
    textBGOpacity = data.old_text_bg_opacity;
    return data;
  }

  changeTextVAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_valign = ele.data("text_valign");
      ele.data("text_valign", data.newTextValign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreTextVAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      ele.data("text_valign", data.old_text_valign);
    });
    return data;
  }

  changeTextHAlign(data: any) {
    data.activeEles.forEach((ele: any) => {
      data.old_text_halign = ele.data("text_halign");
      ele.data("text_halign", data.newTextHalign);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    return data;
  }

  restoreTextHAlign(data: any){
    data.activeEles.forEach((ele: any) => {
      ele.data("text_halign", data.old_text_halign);
    })
    return data;
  }

  changeGBOpacity(data: any, gbOpacity: any) {
    data.activeGbs.forEach((ele: any) => {
      data.old_gb_opacity = ele.data("group_opacity");
      ele._private['data'] = {...ele._private['data']};
      ele.data("group_opacity", data.newGbOpacity);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    gbOpacity = data.newGbOpacity;
    return data;
  }

  restoreGBOpacity(data: any, gbOpacity: any) {
    data.activeGbs.forEach((ele: any) => {
      ele.data("group_opacity", data.old_gb_opacity);
    })
    gbOpacity = data.old_gb_opacity;
    return data;
  }

  changeGBColor(data: any, gbColor: any) {
    data.activeGbs.forEach((ele: any) => {
      data.old_gb_color = ele.data("color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("color", data.newGbColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    });

    gbColor = this.helpers.fullColorHex(data.newGbColor);
    return data;
  }

  restoreGBColor(data: any, gbColor: any) {
    data.activeGbs.forEach((ele: any) => {
      ele.data("color", data.old_gb_color);
    });

    gbColor = this.helpers.fullColorHex(data.old_gb_color);
    return data;
  }

  changeGBBorderColor(data: any, gbBorderColor: any) {
    data.activeGbs.forEach((ele: any) => {
      data.old_gb_border_color = ele.data("border_color");
      ele._private['data'] = {...ele._private['data']};
      ele.data("border_color", data.newGbBorderColor);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })

    gbBorderColor = this.helpers.fullColorHex(data.newGbBorderColor);
    return data;
  }

  restoreGBBorderColor(data: any, gbBorderColor: any) {
    data.activeGbs.forEach((ele: any) => {
      ele.data("border_color", data.old_gb_border_color);
    });

    gbBorderColor = this.helpers.fullColorHex(data.old_gb_border_color);
    return data;
  }

  changeGBType(data: any, gbBorderTypeActivated: any) {
    data.activeGbs.forEach((ele: any) => {
      data.old_gb_border_type = ele.data("border_style");
      ele._private['data'] = {...ele._private['data']};
      ele.data("border_style", data.newGbBorderType);
      const d = ele.data();
      if (!d.new) {
        d.updated = true;
      }
    })
    gbBorderTypeActivated = data.newGbBorderType;
    return data;
  }

  restoreGBType(data: any, gbBorderTypeActivated: any) {
    data.activeGbs.forEach((ele: any) => {
      ele.data("border_style", data.old_gb_border_type);
    });
    gbBorderTypeActivated = data.old_gb_border_type;
    return data;
  }
}
