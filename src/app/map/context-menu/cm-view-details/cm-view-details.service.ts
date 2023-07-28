import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUpdateNodeDialogComponent } from 'src/app/map/add-update-node-dialog/add-update-node-dialog.component';
import { AddUpdateInterfaceDialogComponent } from '../../add-update-interface-dialog/add-update-interface-dialog.component';
import { AddUpdatePGDialogComponent } from '../../add-update-pg-dialog/add-update-pg-dialog.component';
import { ViewUpdateProjectNodeComponent } from "../cm-dialog/view-update-project-node/view-update-project-node.component";
import { ToastrService } from "ngx-toastr";
import { InterfaceService } from 'src/app/core/services/interface/interface.service';
import { Store } from '@ngrx/store';
import { retrievedInterfacesByHwNodes } from 'src/app/store/interface/interface.actions';
import { Subscription } from "rxjs";
import { selectLogicalNodes } from "../../../store/node/node.selectors";
import { selectMapPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectLogicalMapInterfaces } from "../../../store/interface/interface.selectors";

@Injectable({
  providedIn: 'root'
})
export class CMViewDetailsService implements OnDestroy {

  nodes: any[] = [];
  portgroups: any[] = [];
  interfaces: any[] = [];
  selectLogicalNodes$ = new Subscription();
  selectMapPortGroups$ = new Subscription();
  selectLogicalMapInterfaces$ = new Subscription();

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private interfaceService: InterfaceService,
    private store: Store
  ) {
    this.selectLogicalNodes$ = this.store.select(selectLogicalNodes).subscribe(nodes => {
      if (nodes) {
        this.nodes = nodes.filter(i => i.isSelected);
      }
    });
    this.selectMapPortGroups$ = this.store.select(selectMapPortGroups).subscribe(portgroups => {
      if (portgroups) {
        this.portgroups = portgroups.filter(i => i.isSelected);
      }
    });
    this.selectLogicalMapInterfaces$ = this.store.select(selectLogicalMapInterfaces).subscribe(interfaces => {
      if (interfaces) {
        this.interfaces = interfaces.filter(i => i.isSelected);
      }
    });
  }

  ngOnDestroy(): void {
     this.selectLogicalNodes$.unsubscribe();
     this.selectMapPortGroups$.unsubscribe();
     this.selectLogicalMapInterfaces$.unsubscribe();
  }

  getMenu(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any, mapCategory: string, projectId: number) {
    return {
      id: "view_details",
      content: "View",
      selector: "node[label!='group_box'], edge, node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.openViewDetailForm(cy, activeNodes, activePGs, activeEdges, activeMapLinks, mapCategory, projectId);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  openViewDetailForm(cy: any, activeNodes: any, activePGs: any, activeEdges: any, activeMapLinks: any, mapCategory: string, projectId: number) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const activeMapLinksLength = activeMapLinks.length;
    if (activeEdgesLength == 1 && activeNodesLength == 0 && activePGsLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.interfaces[0],
        cy
      }
      this.interfaceService.getByProjectIdAndHwNode(projectId).subscribe(response => {
        this.store.dispatch(retrievedInterfacesByHwNodes({ interfacesByHwNodes: response.result }))
        this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '650px', autoFocus: false, data: dialogData });
      })
    } else if (activePGsLength == 1 && activeNodesLength == 0 && activeEdgesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.portgroups[0],
        cy
      }
      this.dialog.open(AddUpdatePGDialogComponent, {
        disableClose: true,
        width: '800px',
        autoFocus: false,
        data: dialogData,
        panelClass: 'custom-node-form-modal'
      });
    } else if (activeNodesLength == 1 && activePGsLength == 0 && activeEdgesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.nodes[0],
        cy,
        mapCategory: mapCategory
      }
      this.dialog.open(AddUpdateNodeDialogComponent,
        { disableClose: true, width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal'}
      );
    } else if (activeMapLinksLength == 1 && activePGsLength == 0 && activeEdgesLength == 0 && activeNodesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: activeMapLinks[0].data(),
        cy
      }
      this.dialog.open(ViewUpdateProjectNodeComponent, { disableClose: true, width: '450px', autoFocus: false, data: dialogData });
    }
  }
}
