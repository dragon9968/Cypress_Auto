import { Component } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { NodeService } from "../../../core/services/node/node.service";
import { MatDialog } from "@angular/material/dialog";
import { CMDeleteService } from "../../context-menu/cm-delete/cm-delete.service";
import { CMEditService } from "../../context-menu/cm-edit/cm-edit.service";
import { CMViewDetailsService } from "../../context-menu/cm-view-details/cm-view-details.service";
import { AddUpdateNodeDialogComponent } from "../../add-update-node-dialog/add-update-node-dialog.component";
import { HelpersService } from "../../../core/services/helpers/helpers.service";
import { Store } from "@ngrx/store";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-info-panel-render',
  templateUrl: './info-panel-render.component.html',
  styleUrls: ['./info-panel-render.component.scss']
})
export class InfoPanelRenderComponent implements ICellRendererAngularComp {
  node_id: any;
  interface_id: any;
  pg_id: any;
  getExternalParams: (() => any) | any;
  selectMapOption$ = new Subscription();
  isGroupBoxesChecked!: boolean;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private nodeService: NodeService,
    private cmViewDetailsService: CMViewDetailsService,
    private cmEditService: CMEditService,
    private cmDeleteService: CMDeleteService,
    private helpers: HelpersService,
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  agInit(params: ICellRendererParams): void {
    this.node_id = params.value;
    this.getExternalParams = (params as any).getExternalParams;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  viewInfoPanel(event: any) {
    this.setDataGetter(event);
    this.cmViewDetailsService.openViewDetailForm(event)
  }

  editInfoPanel() {
    if (this.node_id) {
      this.nodeService.get(this.node_id).subscribe(nodeData => {
        const dialogData = {
          mode: 'update',
          genData: nodeData.result,
          cy: this.getExternalParams().cy
        }
        this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', data: dialogData});
      });
    }
  }

  deleteInfoPanel() {
    const params = this.getExternalParams();
    this.delete(params.cy, params.activeNodes, params.activePGs, params.activeEdges,
      params.activeGBs, params.deletedNodes, params.deletedInterfaces);
  }

  setDataGetter(event: any) {
    event.target.data = () => ({
      node_id: this.node_id,
      interface_id: this.interface_id,
      pg_id: this.pg_id
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
        this.helpers.removeEdge(edge, deletedInterfaces);
        activeEdges.splice(0);
        // TODO: this.tool_panel.update_components();
      }
    });
     activeNodes.concat(activePGs, activeGBs)
      .filter(node => node.data('node_id') === this.node_id)
      .forEach((node: any) => {
        this.helpers.removeNode(node, deletedNodes, deletedInterfaces);
        if (this.isGroupBoxesChecked) {
          cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
            if (gb.children().length == 0) {
              this.helpers.removeNode(gb, deletedNodes, deletedInterfaces);
            }
          });
        }
        const indexNode = activeNodes.findIndex(ele => ele.data('node_id') === this.node_id);
        activeNodes.splice(indexNode, 1);
        activePGs.splice(0);
        activeGBs.splice(0);
        // TODO: this.tool_panel.update_components();
      });
  }
}
