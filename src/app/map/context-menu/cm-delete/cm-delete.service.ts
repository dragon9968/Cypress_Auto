import { Injectable, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';
import { CommonService } from 'src/app/map/context-menu/cm-common-service/common.service';

@Injectable({
  providedIn: 'root'
})
export class CMDeleteService {
  isGroupBoxesChecked!: boolean;
  selectMapOption$ = new Subscription();
  public ur: any;

  constructor(
    private store: Store,
    private commonService: CommonService,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  getMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
    deletedNodes: any[], deletedInterfaces: any[]) {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        this.commonService.delete(cy, activeNodes, activePGs, activeEdges, activeGBs, deletedNodes, deletedInterfaces);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
