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
import { Store } from '@ngrx/store';
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { retrievedInterfacesByDestinationNode, retrievedInterfacesByHwNodes, retrievedInterfacesBySourceNode } from 'src/app/store/interface/interface.actions';
import { ConnectInterfaceDialogComponent } from '../cm-dialog/connect-interface-dialog/connect-interface-dialog.component';
import { retrievedNameNodeBySourceNode } from 'src/app/store/node/node.actions';

@Injectable({
  providedIn: 'root'
})
export class CMEditService {

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store,
    private interfaceService: InterfaceService
  ) {
  }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any, isCanWriteOnProject: boolean, mapCategory: string, projectId: number) {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge, node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.openEditForm(cy, activeNodes, activePGs, activeEdges, activeMapLinks, mapCategory, projectId);
      },
      hasTrailingDivider: false,
      disabled: !isCanWriteOnProject,
    }
  }

  openEditForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any, mapCategory: string, projectId: number) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const activeMapLinksLength = activeMapLinks.length;

    if (activeMapLinksLength == 1) {
      const dialogData = {
        mode: 'update',
        genData: activeMapLinks[0].data(),
        cy
      }
      this.dialog.open(ViewUpdateProjectNodeComponent, { disableClose: true, width: '450px', autoFocus: false, data: dialogData });
    } else if (activeNodesLength == 0 && activePGsLength == 0) {
      if (activeEdgesLength > 1) {
        const edgeActiveIds = activeEdges.map((ele: any) => ele.data('interface_pk'));
        const dialogData = {
          genData: {
            ids: edgeActiveIds,
            activeEles: activeEdges.map((ele: any) => ele.data())
          },
          cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (activeEdgesLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: activeEdges[0].data(),
          cy,
          projectId: projectId
        }
        if (mapCategory === 'logical') {
          this.interfaceService.getByProjectIdAndHwNode(projectId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesByHwNodes({ interfacesByHwNodes: response.result }))
            this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '650px', autoFocus: false, data: dialogData });
          })
        } else {
          const nodeId = activeEdges[0].data('node_id');
          const nodeName = activeEdges[0].data('node');
          this.interfaceService.getByNodeAndConnectedToInterface(nodeId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesBySourceNode({ interfacesBySourceNode: response.result }));
            this.interfaceService.getByProjectIdAndHwNode(projectId).subscribe(interfaceData => {
                const listInterface = interfaceData.result.filter((val: any) => val.node_id != nodeId)
                this.store.dispatch(retrievedInterfacesByDestinationNode({ interfacesByDestinationNode: listInterface }));
                this.store.dispatch(retrievedNameNodeBySourceNode({ nameNode: nodeName }));
                const dialogData = {
                  mode: 'edit_connected_interface',
                  nodeId: nodeId,
                  cy,
                  mapCategory: mapCategory,
                  genData: activeEdges[0].data()
                }
                const dialogRef =  this.dialog.open(ConnectInterfaceDialogComponent, { disableClose: true, width: '850px', data: dialogData, autoFocus: false, panelClass: 'custom-connect-interfaces-form-modal'})
                dialogRef.afterClosed().subscribe(result => {
                  activeEdges.splice(0);
                  cy.edges().unselect();
              })
            })
          })
        }
      }
    } else if (activeNodesLength == 0 && activeEdgesLength == 0) {
      if (activePGsLength > 1) {
        const pgActiveIds = activePGs.map((ele: any) => ele.data('pg_id'));
        const dialogData = {
          genData: {
            ids: pgActiveIds,
            activeEles: activePGs.map((ele: any) => ele.data())
          },
          cy
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (activePGsLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: activePGs[0].data(),
          cy
        }
        this.dialog.open(AddUpdatePGDialogComponent, {
          disableClose: true,
          width: '600px',
          autoFocus: false,
          data: dialogData,
          panelClass: 'custom-node-form-modal'
        });
      }
    } else if (activePGsLength == 0 && activeEdgesLength == 0) {
      if (activeNodesLength > 1) {
        const nodeActiveIds = activeNodes.map((ele: any) => ele.data('node_id'));
        const dialogData = {
          genData: {
            ids: nodeActiveIds,
            activeEles: activeNodes.map((ele: any) => ele.data())
          },
          cy
        }
        this.dialog.open(NodeBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (activeNodesLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: activeNodes[0].data(),
          cy,
          mapCategory: mapCategory
        }
        this.dialog.open(AddUpdateNodeDialogComponent,
          { disableClose: true, width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
        );
      }
    } else  {
      this.toastr.success("Cannot bulk edit for various of element types");
    }
  }
}
