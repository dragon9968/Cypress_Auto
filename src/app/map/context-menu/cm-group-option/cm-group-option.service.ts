import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddNodePgToGroupboxDialogComponent } from '../../add-node-pg-to-groupbox-dialog/add-node-pg-to-groupbox-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CmGroupOptionService {

  constructor(
    private dialog: MatDialog,
  ) { }

  getNodePgGroupMenu(cy: any, activeNodes: any[], activePGs: any[], projectId: any, isCanWriteOnProject: boolean) {
    return {
      id: "group",
      content: "Group",
      selector: "node[icon], node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "add_node_pg_to_group",
          content: "Add",
          onClickFunction: ($event: any) => {
            const dialogData = {
              genData: {
                nodeIds: activeNodes.map((ele: any) => ele.data().node_id),
                activeNodes: activeNodes.map((ele: any) => ele.data()),
                pgIds: activePGs.map((ele: any) => ele.data().pg_id),
                activePGs: activePGs.map((ele: any) => ele.data())
              },
              cy,
              projectId
            }
            this.dialog.open(AddNodePgToGroupboxDialogComponent, {
              disableClose: true,
              autoFocus: false,
              width: '400px',
              data: dialogData,
            });
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
        {
          id: "delete_node_pg_from_group",
          content: "Delete",
          onClickFunction: ($event: any) => {
            activeNodes.forEach(node => {
              node.move({ parent: null })
            })
            activePGs.forEach(pg => {
              pg.move({ parent: null })
            })
          },
          hasTrailingDivider: true,
          disabled: !isCanWriteOnProject,
        },
      ],
      disabled: false,
    }
  }
}
