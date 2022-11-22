import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdateInterfaceDialogComponent } from '../../add-update-interface-dialog/add-update-interface-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';
import { NodeBulkEditDialogComponent } from "../../bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class CMEditService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
    private interfaceService: InterfaceService,
  ) {
  }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any) {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge",
      onClickFunction: (event: any) => {
        this.openEditForm(cy, activeNodes, activePGs, activeEdges, event);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  openEditForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any, event: any) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const data = event.target.data();

    if (activeNodesLength == 0 && activePGsLength == 0) {
      if (activeEdgesLength > 1) {
        const edgeActiveIds = activeEdges.map((ele: any) => ele.data('interface_id'));
        const dialogData = {
          genData: { ids: edgeActiveIds },
          cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData});
      } else if (activeEdgesLength == 1) {
        if (data.interface_id) {
          this.interfaceService.get(data.interface_id).subscribe(interfaceData => {
            const dialogData = {
              mode: 'update',
              genData: interfaceData.result,
              cy
            }
            this.dialog.open(AddUpdateInterfaceDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
          });
        }
      }
    } else if (activeNodesLength == 0 && activeEdgesLength == 0) {
      if (activePGsLength > 1) {
        // this.map_forms.openPGBulkEditForm();
        const pgActiveIds = activePGs.map((ele: any) => ele.data('pg_id'));
        const dialogData = {
          genData: { ids: pgActiveIds },
          cy
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      } else if (activePGsLength == 1) {
        if (data.pg_id) {
          this.portGroupService.get(data.pg_id).subscribe(pgData => {
            const dialogData = {
              mode: 'update',
              genData: pgData.result,
              cy
            }
            this.dialog.open(AddUpdatePGDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
          });
        }
      }
    } else if (activePGsLength == 0 && activeEdgesLength == 0) {
      if (activeNodesLength > 1) {
        // this.map_forms.openNodeBulkEditForm();
        const nodeActiveIds = activeNodes.map((ele: any) => ele.data('node_id'));
        const dialogData = {
          genData: { ids: nodeActiveIds },
          cy
        }
        this.dialog.open(NodeBulkEditDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
      } else if (activeNodesLength == 1) {
        if (data.node_id) {
          this.nodeService.get(data.node_id).subscribe(nodeData => {
            const dialogData = {
              mode: 'update',
              genData: nodeData.result,
              cy
            }
            this.dialog.open(AddUpdateNodeDialogComponent, {width: '600px', autoFocus: false, data: dialogData});
          });
        }
      }
    } else {
      this.toastr.success("Cannot bulk edit for various of element types");
    }
  }
}
