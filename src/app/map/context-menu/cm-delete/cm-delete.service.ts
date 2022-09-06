import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectMapOption } from 'src/app/store/map-option/map-option.selectors';

@Injectable({
  providedIn: 'root'
})
export class CMDeleteService {
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

  getMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
    deletedNodes: any[], deletedInterfaces: any[]) {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        this.delete(cy, activeNodes, activePGs, activeEdges, activeGBs, deletedNodes, deletedInterfaces);
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }

  delete(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
    deletedNodes: any[], deletedInterfaces: any[]) {
    activeEdges.forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.helpers.removeEdge(edge, deletedInterfaces);
        activeEdges.splice(0);
        // this.tool_panel.update_components();
      }
    });
    activeNodes.concat(activePGs, activeGBs).forEach((node: any) => {
      this.helpers.removeNode(node, deletedNodes, deletedInterfaces);
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
}
