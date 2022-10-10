import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { HelpersService } from "./helpers.service";
import { NodeService } from "../node/node.service";
import { InterfaceService } from "../interface/interface.service";
import { PortGroupService } from "../portgroup/portgroup.service";
import { selectMapOption } from "../../../store/map-option/map-option.selectors";
import { AddUpdatePGDialogComponent } from "../../../map/add-update-pg-dialog/add-update-pg-dialog.component";
import { AddUpdateNodeDialogComponent } from "../../../map/add-update-node-dialog/add-update-node-dialog.component";
import { AddUpdateInterfaceDialogComponent } from "../../../map/add-update-interface-dialog/add-update-interface-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { NodeBulkEditDialogComponent } from "../../../map/bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class InfoPanelService {

  selectMapOption$ = new Subscription();
  isGroupBoxesChecked!: boolean;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private helpers: HelpersService,
    private nodeService: NodeService,
    private interfaceService: InterfaceService,
    private portGroupService: PortGroupService
  ) {
    this.selectMapOption$ = this.store.select(selectMapOption).subscribe((mapOption: any) => {
      if (mapOption) {
        this.isGroupBoxesChecked = mapOption.isGroupBoxesChecked;
      }
    });
  }

  delete(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[],
         deletedNodes: any[], deletedInterfaces: any[], tabName: string, id: any) {
    let idName = '';
    if (tabName == 'node') {
      idName = 'node_id';
    } else if (tabName == 'portGroup') {
      idName = 'pg_id';
    } else if (tabName == 'edge') {
      idName = 'interface_id';
    }
    activeEdges.filter(ele => ele.data(idName) === id).forEach((edge: any) => {
      const sourceData = cy.getElementById(edge.data('source')).data();
      const targetData = cy.getElementById(edge.data('target')).data();
      if ('temp' in sourceData || 'temp' in targetData) {
        return
      } else {
        this.helpers.removeEdge(edge, deletedInterfaces);
        const index = activeEdges.findIndex(ele => ele.data(idName) === id);
        activeEdges.splice(index, 1);
        // TODO: this.tool_panel.update_components();
      }
    });

    activeNodes.concat(activePGs, activeGBs)
      .filter(ele => ele.data(idName) === id)
      .forEach((node: any) => {
        // Remove the interface is connecting to the Port Group or Node
        const interfacesDeleted = this.getEdgesConnectingToNode(node);
        for (let i = 0; i < activeEdges.length; i++) {
          const data = activeEdges[i].data();
          if (interfacesDeleted.includes(data.interface_id)) {
            activeEdges.splice(i, 1);
            i--;
          }
        }

        this.helpers.removeNode(node, deletedNodes, deletedInterfaces);
        if (this.isGroupBoxesChecked) {
          cy.nodes().filter('[label="group_box"]').forEach((gb: any) => {
            if (gb.children().length == 0) {
              this.helpers.removeNode(gb, deletedNodes, deletedInterfaces);
            }
          });
        }
        if (idName === 'node_id') {
          const indexNode = activeNodes.findIndex(ele => ele.data(idName) === id);
          activeNodes.splice(indexNode, 1);
        } else if (idName === 'pg_id') {
          const indexNode = activePGs.findIndex(ele => ele.data(idName) === id);
          activePGs.splice(indexNode, 1);
        }
        activeGBs.splice(0);
        // TODO: this.tool_panel.update_components();
      });
  }

  openEditInfoPanelForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any, tabName: string, id: any) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;

    if (activeNodesLength == 0 && activePGsLength == 0) {
      if (activeEdgesLength > 1 && id == undefined) {
        const edgeActiveIds = activeEdges.map((ele: any) => ele.data('interface_id'));
        const dialogData = {
          genData: { ids: edgeActiveIds },
          cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { width: '600px', data: dialogData});
      } else if (activeEdgesLength == 1 || id) {
        this.interfaceService.get(id).subscribe(interfaceData => {
          const dialogData = {
            mode: 'update',
            genData: interfaceData.result,
            cy
          }
          this.dialog.open(AddUpdateInterfaceDialogComponent, {width: '600px', data: dialogData});
        });
      }
    } else if (activeNodesLength == 0 && activeEdgesLength == 0) {
      if (activePGsLength > 1 && id == undefined) {
        const pgActiveIds = activePGs.map((ele: any) => ele.data('pg_id'));
        const dialogData = {
          genData: { ids: pgActiveIds },
          cy
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, {width: '600px', data: dialogData});
      } else if (activePGsLength == 1 || id) {
        this.portGroupService.get(id).subscribe(pgData => {
          const dialogData = {
            mode: 'update',
            genData: pgData.result,
            cy
          }
          this.dialog.open(AddUpdatePGDialogComponent, {width: '600px', data: dialogData});
        });
      }
    } else if (activePGsLength == 0 && activeEdgesLength == 0) {
      if (activeNodesLength > 1 && id == undefined) {
        const nodeActiveIds = activeNodes.map((ele: any) => ele.data('node_id'));
        const dialogData = {
          genData: { ids: nodeActiveIds },
          cy
        }
        this.dialog.open(NodeBulkEditDialogComponent, {width: '600px', data: dialogData});
      } else if (activeNodesLength == 1 || id) {
        this.nodeService.get(id).subscribe(nodeData => {
          const dialogData = {
            mode: 'update',
            genData: nodeData.result,
            cy
          }
          this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', data: dialogData});
        });
      }
    } else {
      this.toastr.success("Cannot bulk edit for various of element types");
    }
  }

  getEdgesConnectingToNode(node: any) {
    const interfacesDeleted: any[] = [];
    node.connectedEdges().forEach((ele: any) => {
      const data = ele.data();
      if (data && !data.new) {
        data.deleted = true;
        interfacesDeleted.push({
          'name': data.id,
          'interface_id': data.interface_id
        });
      }
    });
    return interfacesDeleted.map(ele => ele.interface_id);
  }
}
