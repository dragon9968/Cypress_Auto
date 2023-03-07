import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdateInterfaceDialogComponent } from '../../add-update-interface-dialog/add-update-interface-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';
import { NodeBulkEditDialogComponent } from "../../bulk-edit-dialog/node-bulk-edit-dialog/node-bulk-edit-dialog.component";
import { PortGroupBulkEditDialogComponent } from "../../bulk-edit-dialog/port-group-bulk-edit-dialog/port-group-bulk-edit-dialog.component";
import { InterfaceBulkEditDialogComponent } from "../../bulk-edit-dialog/interface-bulk-edit-dialog/interface-bulk-edit-dialog.component";
import { ViewUpdateProjectNodeComponent } from "../cm-dialog/view-update-project-node/view-update-project-node.component";

@Injectable({
  providedIn: 'root'
})
export class CMEditService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
  }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any) {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge",
      onClickFunction: (event: any) => {
        this.openEditForm(cy, activeNodes, activePGs, activeEdges);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  openEditForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;

    if (activeNodesLength == 0 && activePGsLength == 0) {
      if (activeEdgesLength > 1) {
        const edgeActiveIds = activeEdges.map((ele: any) => ele.data('interface_id'));
        const dialogData = {
          genData: {
            ids: edgeActiveIds,
            activeEdges: activeEdges.map((ele: any) => ele.data())
          },
          cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      } else if (activeEdgesLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: activeEdges[0].data(),
          cy
        }
        this.dialog.open(AddUpdateInterfaceDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      }
    } else if (activeNodesLength == 0 && activeEdgesLength == 0) {
      if (activePGsLength > 1) {
        const pgActiveIds = activePGs.map((ele: any) => ele.data('pg_id'));
        const dialogData = {
          genData: {
            ids: pgActiveIds,
            activePGs: activePGs.map((ele: any) => ele.data())
          },
          cy
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      } else if (activePGsLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: activePGs[0].data(),
          cy
        }
        this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
      }
    } else if (activePGsLength == 0 && activeEdgesLength == 0) {
      if (activeNodesLength > 1) {
        const isExistProjectNode = activeNodes.some((ele: any) => ele.data('category') == 'project');
        if (isExistProjectNode) {
          this.toastr.warning('Bulk edit does not support the project node!', 'Warning');
        } else {
          const nodeActiveIds = activeNodes.map((ele: any) => ele.data('node_id'));
          const dialogData = {
            genData: {
              ids: nodeActiveIds,
              activeNodes: activeNodes.map((ele: any) => ele.data())
            },
            cy
          }
          this.dialog.open(NodeBulkEditDialogComponent, { width: '600px', autoFocus: false, data: dialogData });
        }
      } else if (activeNodesLength == 1) {
        const nodeCategory = activeNodes[0].data('category');
        if (nodeCategory != 'project') {
          const dialogData = {
            mode: 'update',
            genData: activeNodes[0].data(),
            cy
          }
          this.dialog.open(AddUpdateNodeDialogComponent,
            { width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
          );
        } else {
          const dialogData = {
            mode: 'update',
            genData: activeNodes[0].data(),
            cy
          }
          this.dialog.open(ViewUpdateProjectNodeComponent, { width: '450px', autoFocus: false, data: dialogData });
        }
      }
    } else {
      this.toastr.success("Cannot bulk edit for various of element types");
    }
  }
}
