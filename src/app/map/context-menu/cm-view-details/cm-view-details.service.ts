import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NodeService } from 'src/app/core/services/node/node.service';
import { PortGroupService } from 'src/app/core/services/portgroup/portgroup.service';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CMViewDetailsService {

  constructor(
    private dialog: MatDialog,
    private nodeService: NodeService,
    private portGroupService: PortGroupService,
  ) {}

  getMenu() {
    return {
      id: "view_details",
      content: "View",
      selector: "node[label!='group_box'], edge",
      onClickFunction: (event: any) => {
        let data = event.target.data()
        if (data.interface_id) {
          // this.map_forms.openInterfaceInfo(data.interface_id);
        } else if (data.pg_id) {
          this.portGroupService.get(data.pg_id).subscribe(pgData => {
            const dialogData = {
              mode: 'view',
              genData: pgData.result,
            }
            this.dialog.open(AddUpdatePGDialogComponent, { width: '600px', data: dialogData });
          });
        } else if (data.node_id) {
          this.nodeService.get(data.node_id).subscribe(nodeData => {
            const dialogData = {
              mode: 'view',
              genData: nodeData.result,
            }
            this.dialog.open(AddUpdateNodeDialogComponent, { width: '600px', data: dialogData });
          });
        }
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
