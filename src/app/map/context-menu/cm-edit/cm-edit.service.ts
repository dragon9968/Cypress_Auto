import { Injectable, OnDestroy } from '@angular/core';
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
import { selectLogicalMapInterfaces, selectSelectedLogicalInterfaces } from 'src/app/store/interface/interface.selectors';
import { Subscription } from 'rxjs';
import { selectLogicalNodes, selectSelectedLogicalNodes } from 'src/app/store/node/node.selectors';
import { selectMapPortGroups, selectSelectedPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { selectSelectedMapLinks } from "../../../store/map-link/map-link.selectors";
import { ProjectService } from "../../../project/services/project.service";
import { retrievedAllProjects } from "../../../store/project/project.actions";

@Injectable({
  providedIn: 'root'
})
export class CMEditService implements OnDestroy {

  selectedNodes: any[] = [];
  selectedPGs: any[] = [];
  selectedInterfaces: any[] = [];
  selectedMapLinks: any[] = [];
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectSelectedLogicalInterfaces$ = new Subscription();
  selectSelectedMapLinks$ = new Subscription();
  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private store: Store,
    private interfaceService: InterfaceService,
    private projectService: ProjectService
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedNodes = selectedNodes;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGs = selectedPGs;
      }
    });
    this.selectSelectedLogicalInterfaces$ = this.store.select(selectSelectedLogicalInterfaces).subscribe(selectedInterfaces => {
      if (selectedInterfaces) {
        this.selectedInterfaces = selectedInterfaces;
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(selectedMapLinks => {
      if (selectedMapLinks) {
        this.selectedMapLinks = selectedMapLinks;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectSelectedPortGroups$.unsubscribe();
    this.selectSelectedLogicalInterfaces$.unsubscribe();
    this.selectSelectedMapLinks$.unsubscribe();
  }

  getMenu(cy: any, isCanWriteOnProject: boolean, mapCategory: string, projectId: number) {
    return {
      id: "edit",
      content: "Edit",
      selector: "node[label!='group_box'], node[label='map_background'], edge, node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.openEditForm(cy, mapCategory, projectId);
      },
      hasTrailingDivider: false,
      disabled: !isCanWriteOnProject,
    }
  }

  openEditForm(cy: any, mapCategory: string, projectId: number) {
    const selectedNodesLength = this.selectedNodes.length;
    const selectedPGsLength = this.selectedPGs.length;
    const selectedInterfacesLength = this.selectedInterfaces.length;
    const selectedMapLinksLength = this.selectedMapLinks.length;

    if (selectedMapLinksLength == 1) {
      this.projectService.getProjectByStatus('active').subscribe(resp => {
        this.store.dispatch(retrievedAllProjects({ listAllProject: resp.result }));
        const dialogData = {
          mode: 'update',
          genData: this.selectedMapLinks[0],
          cy
        }
        this.dialog.open(ViewUpdateProjectNodeComponent, { disableClose: true, width: '450px', autoFocus: false, data: dialogData });
      })
    } else if (selectedNodesLength == 0 && selectedPGsLength == 0) {
      if (selectedInterfacesLength > 1) {
        const edgeActiveIds = this.selectedInterfaces.map((ele: any) => ele.id);
        const dialogData = {
          genData: {
            ids: edgeActiveIds,
            activeEles: this.selectedInterfaces
          },
          cy
        };
        this.dialog.open(InterfaceBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (selectedInterfacesLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: this.selectedInterfaces[0],
          cy,
          projectId: projectId
        }
        if (mapCategory === 'logical') {
          this.interfaceService.getByProjectIdAndHwNode(projectId).subscribe(response => {
            this.store.dispatch(retrievedInterfacesByHwNodes({ interfacesByHwNodes: response.result }))
            this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '650px', autoFocus: false, data: dialogData });
          })
        } else {
          const nodeId = this.selectedInterfaces[0].data.node_id;
          const nodeName = this.selectedInterfaces[0].data.node;
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
                  genData: this.selectedInterfaces[0]
                }
                const dialogRef =  this.dialog.open(ConnectInterfaceDialogComponent, { disableClose: true, width: '850px', data: dialogData, autoFocus: false, panelClass: 'custom-connect-interfaces-form-modal'})
                dialogRef.afterClosed().subscribe(result => {
                  cy.edges().unselect();
              })
            })
          })
        }
      }
    } else if (selectedNodesLength == 0 && selectedInterfacesLength == 0) {
      if (selectedPGsLength > 1) {
        const pgActiveIds = this.selectedPGs.map((ele: any) => ele.id);
        const dialogData = {
          genData: {
            ids: pgActiveIds,
            activeEles: this.selectedPGs
          },
          cy
        }
        this.dialog.open(PortGroupBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (selectedPGsLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: this.selectedPGs[0],
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
    } else if (selectedPGsLength == 0 && selectedInterfacesLength == 0) {
      if (selectedNodesLength > 1) {
        const nodeActiveIds = this.selectedNodes.map((ele: any) => ele.id);
        const dialogData = {
          genData: {
            ids: nodeActiveIds,
            activeEles: this.selectedNodes
          },
          cy
        }
        this.dialog.open(NodeBulkEditDialogComponent, { disableClose: true, width: '600px', autoFocus: false, data: dialogData });
      } else if (selectedNodesLength == 1) {
        const dialogData = {
          mode: 'update',
          genData: this.selectedNodes[0],
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
