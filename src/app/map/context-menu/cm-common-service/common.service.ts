import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { StyleService } from 'src/app/core/services/helpers/style.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @Input() ur: any;
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  constructor(
    private store: Store,
    private helpers: HelpersService,
    private styleService: StyleService,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  delete(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
    deletedNodes: any[], deletedInterfaces: any[]) {
    activeEdges.forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        // this.helpers.removeEdge(edge, deletedInterfaces);
        this.ur?.do('removeEdge', edge, deletedInterfaces);
        activeEdges.splice(0);
        // this.tool_panel.update_components();
      }
    });
    activeNodes.concat(activePGs, activeGBs).forEach((node: any) => {
      this.ur?.do('removeNode', node, deletedNodes, deletedInterfaces);
      if (this.isGroupBoxesChecked) {
        cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
          if (gb.children().length == 0) {
            this.helpers.removeNode(gb, deletedNodes, deletedInterfaces);
          }
        });
      }
      activeNodes.splice(0);
      activePGs.splice(0);
      activeGBs.splice(0);
      // this.tool_panel.update_components();
    });
  }

  changeNode(activeNodes: any[], nodeSize: number) {
    const data = this.ur?.do('changeNodeSize', { activeNodes, nodeSize });
    activeNodes = data.activeNodes;
  }

  textColor(color: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], textColor: any) {
    // this.helpers.changTextColor(data, textColor);
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const activeEles = activeNodes.concat(activeEdges, activePGs, activeGBs);
      this.ur?.do('changTextColor', { activeEles, newColor }, textColor);
    }
  }

  textSize(size: any, textSize: number, activeNodes: any[], activeEdges: any[], activePGs: any[]) {
    const newTextSize = size.value
    const activeEles = activeNodes.concat(activeEdges, activePGs);
    this.ur?.do('changeTextSize', {activeEles, newTextSize}, textSize);
  }

  pgColor(color: any, activePGs: any[], pgColor: any) {
    const newPgColor = color;
    // this.styleService.changePGColor({activePGs, newPgColor}, pgColor);
    this.ur?.do('changePGColor', {activePGs, newPgColor}, pgColor);
  }

  pgSize(size: any, activePgs: any[], pgSize: any) {
    const newPgSize = size.value;
    this.ur?.do('changePGSize', {activePgs, newPgSize}, pgSize);
  }

  edgeColor (color: any, activeEdges: any[], edgeColor: any) {
    const newEdgeColor = color;
    this.ur?.do('changeEdgeColor', {activeEdges, newEdgeColor}, edgeColor);
  }

  edgeSize (size: any, activeEdges: any[], edgeSize: number) {
    const newEdgeSize = size.value;
    this.ur?.do('changeEdgeSize', {activeEdges, newEdgeSize}, edgeSize);
  }

  arrowScale(size: any, activeEdges: any[], arrowSize: number) {
    const newArrowScale = size.value;
    this.ur?.do('changeArrowScale', {activeEdges, newArrowScale}, arrowSize);
  }

  edgeDirection(value: string, activeEdges: any[]) {
    const newDirection = value;
    this.ur?.do('changeDirection', {activeEdges, newDirection});
  }

  textBGColor(color: any, activeNodes: any[], activeEdges: any[], activePGs: any[], activeGBs: any[], textBGColor: any) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const activeEles = activeNodes.concat(activeEdges, activePGs, activeGBs);
      this.ur?.do('changeTextBGColor', { activeEles, newColor }, textBGColor);
    }
  }

  textBGOpacity(opacity: any, activeNodes: any[], activeEdges: any[], activePGs: any[], textBGOpacity: any) {
    const newTextBgOpacity = opacity.value;
    const activeEles = activeNodes.concat(activeEdges, activePGs);
    this.ur?.do('changeTextBGOpacity', {activeEles, newTextBgOpacity}, textBGOpacity);
  }

  textVAlign(value: string, activeNodes: any[], activePGs: any[]) {
    const newTextValign = value;
    const activeEles = activeNodes.concat(activePGs);
    this.ur?.do('changeTextVAlign', {activeEles, newTextValign});
  }

  textHAlign(value: string, activeNodes: any[], activePGs: any[]) {
    const newTextHalign = value;
    const activeEles = activeNodes.concat(activePGs);
    this.ur?.do('changeTextHAlign', {activeEles, newTextHalign})
  }

  gbOpacity(event: any, activeGbs: any[], gbOpacity: any){
    const newGbOpacity = event.value;
    this.ur?.do('changeGBOpacity', {activeGbs, newGbOpacity}, gbOpacity);
  }

  gBColor(newGbColor: any, activeGbs: any[], gbColor: any) {
    // this.styleService.changeGBColor({activeGbs, newGbColor}, gbColor);
    this.ur?.do('changeGBColor', {activeGbs, newGbColor}, gbColor);
  }

  gBBorderColor(newGbBorderColor: any, activeGbs: any[], gbBorderColor: any) {
    // this.styleService.changeGBBorderColor({activeGbs, newGbBorderColor}, gbBorderColor);
    this.ur?.do('changeGBBorderColor', {activeGbs, newGbBorderColor}, gbBorderColor);
  }

  gBType(newGbBorderType: any, activeGbs: any[], gbBorderTypeActivated: any) {
    this.ur?.do('changeGBType', {activeGbs, newGbBorderType}, gbBorderTypeActivated);
  }
}