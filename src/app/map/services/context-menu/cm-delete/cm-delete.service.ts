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
    deletedNodes: any[], deletedInterface: any[]) {
    return {
      id: "delete",
      content: "Delete",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        activeEdges.forEach((edge: any) => {
          const sourceData = cy.getElementById(edge.data('source')).data();
          const targetData = cy.getElementById(edge.data('target')).data();
          if ('temp' in sourceData || 'temp' in targetData) {
            return
          } else {
            // removeEdge(edge);
            activeEdges = [];
            // this.tool_panel.update_components();
          }
        });
        activeNodes.concat(activePGs, activeGBs).forEach((node: any) => {
          this.helpers.removeNode(node, deletedNodes, deletedInterface);
          if (this.isGroupBoxesChecked) {
            cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
              if (gb.children().length == 0) {
                this.helpers.removeNode(gb, deletedNodes, deletedInterface);
              }
            });
          }
          activeNodes = [];
          activePGs = [];
          activeGBs = [];
          // this.tool_panel.update_components();
        });
      },
      hasTrailingDivider: true,
      disabled: false,
    }
  }
}
