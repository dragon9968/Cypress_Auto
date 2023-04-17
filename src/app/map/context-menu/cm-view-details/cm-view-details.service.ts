import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdateInterfaceDialogComponent } from '../../add-update-interface-dialog/add-update-interface-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';
import { ViewUpdateProjectNodeComponent } from "../cm-dialog/view-update-project-node/view-update-project-node.component";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class CMViewDetailsService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any) {
    return {
      id: "view_details",
      content: "View",
      selector: "node[label!='group_box'], edge, node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.openViewDetailForm(cy, activeNodes, activePGs, activeEdges, activeMapLinks);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  openViewDetailForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const activeMapLinksLength = activeMapLinks.length;
    if (activeEdgesLength == 1 && activeNodesLength == 0 && activePGsLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: activeEdges[0].data(),
        cy
      }
      this.dialog.open(AddUpdateInterfaceDialogComponent, { hasBackdrop: false, width: '650px', autoFocus: false, data: dialogData });
    } else if (activePGsLength == 1 && activeNodesLength == 0 && activeEdgesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: activePGs[0].data(),
        cy
      }
      this.dialog.open(AddUpdatePGDialogComponent, { hasBackdrop: false, width: '600px', autoFocus: false, data: dialogData });
    } else if (activeNodesLength == 1 && activePGsLength == 0 && activeEdgesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: activeNodes[0].data(),
        cy
      }
      this.dialog.open(AddUpdateNodeDialogComponent,
        { hasBackdrop: false, width: '1000px', height: '900px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal'}
      );
    } else if (activeMapLinksLength == 1 && activePGsLength == 0 && activeEdgesLength == 0 && activeNodesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: activeMapLinks[0].data(),
        cy
      }
      this.dialog.open(ViewUpdateProjectNodeComponent, { hasBackdrop: false, width: '450px', autoFocus: false, data: dialogData });
    }
  }
}
