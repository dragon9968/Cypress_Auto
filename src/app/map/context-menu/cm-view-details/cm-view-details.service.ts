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
import { selectSelectedLogicalNodes, selectSelectedPhysicalNodes } from "../../../store/node/node.selectors";
import { selectSelectedPortGroups } from "../../../store/portgroup/portgroup.selectors";
import { selectSelectedLogicalInterfaces, selectSelectedPhysicalInterfaces } from "../../../store/interface/interface.selectors";
import { selectSelectedMapLinks } from "../../../store/map-link/map-link.selectors";
import { ProjectService } from "../../../project/services/project.service";

@Injectable({
  providedIn: 'root'
})
export class CMViewDetailsService implements OnDestroy {

  selectedNodes: any[] = [];
  selectedLogicalNodes: any[] = [];
  selectedPhysicalNodes: any[] = [];
  selectedPGs: any[] = [];
  selectedInterfaces: any[] = [];
  selectedLogicalInterfaces: any[] = [];
  selectedPhysicalInterfaces: any[] = [];
  selectedMapLinks: any[] = [];
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectSelectedLogicalInterfaces$ = new Subscription();
  selectSelectedMapLinks$ = new Subscription();
  selectSelectedPhysicalNodes$ = new Subscription();
  selectSelectedPhysicalInterfaces$ = new Subscription();

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private interfaceService: InterfaceService,
    private projectService: ProjectService
  ) {
    this.selectSelectedLogicalNodes$ = this.store.select(selectSelectedLogicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedLogicalNodes = selectedNodes;
      }
    });
    this.selectSelectedPhysicalNodes$ = this.store.select(selectSelectedPhysicalNodes).subscribe(selectedNodes => {
      if (selectedNodes) {
        this.selectedPhysicalNodes = selectedNodes;
      }
    });
    this.selectSelectedPortGroups$ = this.store.select(selectSelectedPortGroups).subscribe(selectedPGs => {
      if (selectedPGs) {
        this.selectedPGs = selectedPGs;
      }
    });
    this.selectSelectedLogicalInterfaces$ = this.store.select(selectSelectedLogicalInterfaces).subscribe(selectedInterfaces => {
      if (selectedInterfaces) {
        this.selectedLogicalInterfaces = selectedInterfaces;
      }
    });
    this.selectSelectedPhysicalInterfaces$ = this.store.select(selectSelectedPhysicalInterfaces).subscribe(selectedInterfaces => {
      if (selectedInterfaces) {
        this.selectedPhysicalInterfaces = selectedInterfaces;
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(selectedMapLinks => {
      if (selectedMapLinks) {
        this.selectedMapLinks = selectedMapLinks
      }
    })
  }

  ngOnDestroy(): void {
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectSelectedPortGroups$.unsubscribe();
    this.selectSelectedLogicalInterfaces$.unsubscribe();
    this.selectSelectedMapLinks$.unsubscribe();
    this.selectSelectedPhysicalNodes$.unsubscribe();
    this.selectSelectedPhysicalInterfaces$.unsubscribe();
  }

  getMenu(cy: any, mapCategory: string, projectId: number) {
    return {
      id: "view_details",
      content: "View",
      selector: "node[label!='group_box'], edge, node[elem_category='map_link']",
      onClickFunction: (event: any) => {
        this.openViewDetailForm(cy, mapCategory, projectId);
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  openViewDetailForm(cy: any, mapCategory: string, projectId: number) {
    this.selectedNodes = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes;
    this.selectedInterfaces = mapCategory === 'logical' ? this.selectedLogicalInterfaces : this.selectedPhysicalInterfaces;
    const selectedNodesLength = this.selectedNodes.length;
    const selectedPGsLength = this.selectedPGs.length;
    const selectedInterfacesLength = this.selectedInterfaces.length;
    const selectedMapLinksLength = this.selectedMapLinks.length;
    if (selectedInterfacesLength == 1 && selectedNodesLength == 0 && selectedPGsLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.selectedInterfaces[0],
        cy
      }
      this.interfaceService.getByProjectIdAndHwNode(projectId).subscribe(response => {
        this.store.dispatch(retrievedInterfacesByHwNodes({ interfacesByHwNodes: response.result }))
        this.dialog.open(AddUpdateInterfaceDialogComponent, { disableClose: true, width: '650px', autoFocus: false, data: dialogData });
      })
    } else if (selectedPGsLength == 1 && selectedNodesLength == 0 && selectedInterfacesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.selectedPGs[0],
        cy
      }
      this.dialog.open(AddUpdatePGDialogComponent, {
        disableClose: true,
        width: '800px',
        autoFocus: false,
        data: dialogData,
        panelClass: 'custom-node-form-modal'
      });
    } else if (selectedNodesLength == 1 && selectedPGsLength == 0 && selectedInterfacesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.selectedNodes[0],
        cy,
        mapCategory: mapCategory
      }
      this.dialog.open(AddUpdateNodeDialogComponent,
        { disableClose: true, width: '1000px', autoFocus: false, data: dialogData, panelClass: 'custom-node-form-modal' }
      );
    } else if (selectedMapLinksLength == 1 && selectedPGsLength == 0 && selectedInterfacesLength == 0 && selectedNodesLength == 0) {
      const dialogData = {
        mode: 'view',
        genData: this.selectedMapLinks[0],
        cy
      }
      this.dialog.open(ViewUpdateProjectNodeComponent,
        { disableClose: true, width: '450px', autoFocus: false, data: dialogData }
      );
    }
  }
}
