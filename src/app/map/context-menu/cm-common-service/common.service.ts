import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @Input() ur: any;
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();

  constructor(private store: Store) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  changeNodeSize(size: any, selectedNodes: any[], cy: any) {
    const newNodeSize = size.value;
    this.ur?.do('changeNodeSize', { selectedNodes, newNodeSize, cy });
  }

  changeMapImageSize(size: any, selectedMapImages: any[], cy: any) {
    const newMapImageSize = size.value;
    this.ur?.do('changeMapImageSize', { selectedMapImages, newMapImageSize, cy})
  }

  textColor(color: any, selectedNodes: any[], selectedPortGroups: any[], selectedInterfaces: any[], selectedGroups: any[], cy: any) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newTextColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups, selectedGroups);
      this.ur?.do('changTextColor', { selectedEles, newTextColor, cy });
    }
  }

  textSize(size: any, selectedNodes: any[], selectedInterfaces: any[], selectedPortGroups: any[], cy: any) {
    const newTextSize = size.value
    const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups);
    this.ur?.do('changeTextSize', {selectedEles, newTextSize, cy});
  }

  pgColor(color: any, selectedPortGroups: any[], cy: any) {
    const newPGColor = color;
    this.ur?.do('changePGColor', {selectedPortGroups, newPGColor, cy});
  }

  pgSize(size: any, selectedPortGroups: any[], cy: any) {
    const newPGSize = size.value;
    this.ur?.do('changePGSize', {selectedPortGroups, newPGSize, cy});
  }

  edgeColor (color: any, selectedInterfaces: any[], cy: any) {
    const newEdgeColor = color;
    this.ur?.do('changeEdgeColor', {selectedInterfaces, newEdgeColor, cy});
  }

  edgeSize (size: any, selectedInterfaces: any[], cy: any) {
    const newEdgeSize = size.value;
    this.ur?.do('changeEdgeSize', {selectedInterfaces, newEdgeSize, cy});
  }

  arrowScale(size: any, selectedInterfaces: any[], cy: any) {
    const newArrowScale = size.value;
    this.ur?.do('changeArrowScale', {selectedInterfaces, newArrowScale, cy});
  }

  edgeDirection(value: string, selectedInterfaces: any[], cy: any) {
    const newDirection = value;
    this.ur?.do('changeDirection', {selectedInterfaces, newDirection, cy});
  }

  textBGColor(color: any, selectedNodes: any[], selectedInterfaces: any[], selectedPortGroups: any[], selectedGroups: any[], cy: any) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newTextBGColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups, selectedGroups);
      this.ur?.do('changeTextBGColor', { selectedEles, newTextBGColor, cy });
    }
  }

  textBGOpacity(opacity: any, selectedNodes: any[], selectedInterfaces: any[], selectedPortGroups: any[], cy: any) {
    const newTextBGOpacity = opacity.value;
    const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups);
    this.ur?.do('changeTextBGOpacity', {selectedEles, newTextBGOpacity, cy});
  }

  textOutlineColor(color: any, selectedNodes: any[], selectedInterfaces: any[], selectedPortGroups: any[], selectedGroups: any[], cy: any) {
    const hexPattern = '#d{0,}';
    const hexColor = color;
    const hexPatternFound = hexColor.match(hexPattern)
    if (hexPatternFound) {
      const r = parseInt(hexColor.slice(1, 3), 16).toString();
      const g = parseInt(hexColor.slice(3, 5), 16).toString();
      const b = parseInt(hexColor.slice(5, 7), 16).toString();
      const newTextOutlineColor = "rgb(" + r + ',' + g + ',' + b + ")";
      const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups, selectedGroups);
      this.ur?.do('changeTextOutlineColor', { selectedEles, newTextOutlineColor, cy });
    }
  }

  textOutlineWidth(width: any, selectedNodes: any[], selectedInterfaces: any[], selectedPortGroups: any[], selectedGroups: any[], cy: any) {
    const newTextOutlineWidth = width.value;
    const selectedEles = selectedNodes.concat(selectedInterfaces, selectedPortGroups, selectedGroups);
    this.ur?.do('changeTextOutlineWidth', {selectedEles, newTextOutlineWidth, cy});
  }

  textVAlign(value: string, selectedNodes: any[], selectedPortGroups: any[], cy: any) {
    const newTextVAlign = value;
    const selectedEles = selectedNodes.concat(selectedPortGroups);
    this.ur?.do('changeTextVAlign', {selectedEles, newTextVAlign, cy});
  }

  textHAlign(value: string, selectedNodes: any[], selectedPortGroups: any[], cy: any) {
    const newTextHAlign = value;
    const selectedEles = selectedNodes.concat(selectedPortGroups);
    this.ur?.do('changeTextHAlign', {selectedEles, newTextHAlign, cy})
  }

  gbOpacity(event: any, selectedGroups: any[], cy: any){
    const newGBOpacity = event.value;
    this.ur?.do('changeGBOpacity', {selectedGroups, newGBOpacity, cy});
  }

  gBColor(newGBColor: any, selectedGroups: any[], cy: any) {
    this.ur?.do('changeGBColor', {selectedGroups, newGBColor, cy});
  }

  gBBorderColor(newGBBorderColor: any, selectedGroups: any[], cy: any) {
    this.ur?.do('changeGBBorderColor', {selectedGroups, newGBBorderColor, cy});
  }

  gBType(newGBBorderType: any, selectedGroups: any[], cy: any) {
    this.ur?.do('changeGBType', {selectedGroups, newGBBorderType, cy});
  }

  gbBorderSize(event: any, selectedGroups: any[], cy: any){
    const newGBBorderSize = event.value;
    this.ur?.do('changeGBBorderSize', {selectedGroups, newGBBorderSize, cy});
  }
}
