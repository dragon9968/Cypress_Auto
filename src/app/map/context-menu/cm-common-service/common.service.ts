import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { retrievedMapSelection } from "../../../store/map-selection/map-selection.actions";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @Input() ur: any;
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  constructor(
    private store: Store,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  delete(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[]) {
    [...activeEdges].forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.ur?.do('removeEdge', edge);
        activeEdges.splice(0);
      }
    });
    activeNodes.concat(activePGs, activeGBs).forEach((node: any) => {
      this.ur?.do('removeNode', node);
      if (this.isGroupBoxesChecked) {
        cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
          if (gb.children().length == 0) {
            this.ur?.do('removeNode', gb)
          }
        });
      }
      activeNodes.splice(0);
      activePGs.splice(0);
      activeGBs.splice(0);
    });
    this.store.dispatch(retrievedMapSelection({data: true}));
  }

  changeNodeSize(size: any, activeNodes: any[]) {
    const newNodeSize = size.value;
    this.ur?.do('changeNodeSize', { activeNodes, newNodeSize });
  }

  textColor(color: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[]) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newTextColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const activeEles = activeNodes.concat(activeEdges, activePGs, activeGBs);
      this.ur?.do('changTextColor', { activeEles, newTextColor });
    }
  }

  textSize(size: any, activeNodes: any[], activeEdges: any[], activePGs: any[]) {
    const newTextSize = size.value
    const activeEles = activeNodes.concat(activeEdges, activePGs);
    this.ur?.do('changeTextSize', {activeEles, newTextSize});
  }

  pgColor(color: any, activePGs: any[]) {
    const newPGColor = color;
    this.ur?.do('changePGColor', {activePGs, newPGColor});
  }

  pgSize(size: any, activePGs: any[]) {
    const newPGSize = size.value;
    this.ur?.do('changePGSize', {activePGs, newPGSize});
  }

  edgeColor (color: any, activeEdges: any[]) {
    const newEdgeColor = color;
    this.ur?.do('changeEdgeColor', {activeEdges, newEdgeColor});
  }

  edgeSize (size: any, activeEdges: any[]) {
    const newEdgeSize = size.value;
    this.ur?.do('changeEdgeSize', {activeEdges, newEdgeSize});
  }

  arrowScale(size: any, activeEdges: any[]) {
    const newArrowScale = size.value;
    this.ur?.do('changeArrowScale', {activeEdges, newArrowScale});
  }

  edgeDirection(value: string, activeEdges: any[]) {
    const newDirection = value;
    this.ur?.do('changeDirection', {activeEdges, newDirection});
  }

  textBGColor(color: any, activeNodes: any[], activeEdges: any[], activePGs: any[], activeGBs: any[]) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newTextBGColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const activeEles = activeNodes.concat(activeEdges, activePGs, activeGBs);
      this.ur?.do('changeTextBGColor', { activeEles, newTextBGColor });
    }
  }

  textBGOpacity(opacity: any, activeNodes: any[], activeEdges: any[], activePGs: any[]) {
    const newTextBGOpacity = opacity.value;
    const activeEles = activeNodes.concat(activeEdges, activePGs);
    this.ur?.do('changeTextBGOpacity', {activeEles, newTextBGOpacity});
  }

  textVAlign(value: string, activeNodes: any[], activePGs: any[]) {
    const newTextVAlign = value;
    const activeEles = activeNodes.concat(activePGs);
    this.ur?.do('changeTextVAlign', {activeEles, newTextVAlign});
  }

  textHAlign(value: string, activeNodes: any[], activePGs: any[]) {
    const newTextHAlign = value;
    const activeEles = activeNodes.concat(activePGs);
    this.ur?.do('changeTextHAlign', {activeEles, newTextHAlign})
  }

  gbOpacity(event: any, activeGBs: any[]){
    const newGBOpacity = event.value;
    this.ur?.do('changeGBOpacity', {activeGBs, newGBOpacity});
  }

  gBColor(newGBColor: any, activeGBs: any[]) {
    this.ur?.do('changeGBColor', {activeGBs, newGBColor});
  }

  gBBorderColor(newGBBorderColor: any, activeGBs: any[]) {
    this.ur?.do('changeGBBorderColor', {activeGBs, newGBBorderColor});
  }

  gBType(newGBBorderType: any, activeGBs: any[]) {
    this.ur?.do('changeGBType', {activeGBs, newGBBorderType});
  }
}
