import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CMEditService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
  ) { }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any) {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge",
      onClickFunction: (event: any) => {
        const activeNodesLength = activeNodes.length;
        const activePGsLength = activePGs.length;
        const activeEdgesLength = activeEdges.length;
        const data = event.target.data();

        if (activeNodesLength == 0 && activePGsLength == 0) {
          if (activeEdgesLength > 1) {
            this.toastr.success("Open bulk edit form for edges");
          } else if (activeEdgesLength == 1) {
            if (data.interface_id) {
              // this.map_forms.openInterfaceEditForm(data.interface_id)
            }
          }
        } else if (activeNodesLength == 0 && activeEdgesLength == 0) {
          if (activePGsLength > 1) {
            // this.map_forms.openPGBulkEditForm();
          } else if (activePGsLength == 1) {
            if (data.pg_id) {
              this.portGroupService.get(data.pg_id).subscribe(pgData => {
                const dialogData = {
                  mode: 'update',
                  genData: pgData.result,
                  cy
                }
                this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', data: dialogData });
              });
            }
          }
        } else if (activePGsLength == 0 && activeEdgesLength == 0) {
          if (activeNodesLength > 1) {
            // this.map_forms.openNodeBulkEditForm();
          } else if (activeNodesLength == 1) {
            if (data.node_id) {
              this.nodeService.get(data.node_id).subscribe(nodeData => {
                const dialogData = {
                  mode: 'update',
                  genData: nodeData.result,
                  cy
                }
                this.dialog.open(AddUpdateNodeDialogComponent, { width: '600px', data: dialogData });
              });
            }
          }
        } else {
          this.toastr.success("Cannot bulk edit for various of element types");
        }
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
