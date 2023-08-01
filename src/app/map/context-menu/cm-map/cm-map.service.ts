import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectAllGroup, unSelectAllGroup } from 'src/app/store/group/group.actions';
import { selectAllInterface, unselectAllInterface } from 'src/app/store/interface/interface.actions';
import { retrievedMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.actions';
import { selectAllNode, unSelectAllNode } from 'src/app/store/node/node.actions';
import { selectAllPG, unselectAllPG } from 'src/app/store/portgroup/portgroup.actions';

@Injectable({
  providedIn: 'root'
})
export class CMMapService {

  constructor(
    private store: Store,
    private helpersService: HelpersService,
    private toastr: ToastrService,
  ) { }

  getSaveChangesMenu(isCanWriteOnProject: boolean) {
    return {
      id: "save_changes",
      content: "Save Changes",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        this.store.dispatch(retrievedMapContextMenu({ data: { event: 'save' } }));
      },
      hasTrailingDivider: false,
      disabled: !isCanWriteOnProject,
    }
  }

  getUndoMenu() {
    return {
      id: "undo",
      content: "Undo",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        this.store.dispatch(retrievedMapContextMenu({ data: { event: 'undo' } }));
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getRedoMenu() {
    return {
      id: "redo",
      content: "Redo",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        this.store.dispatch(retrievedMapContextMenu({ data: { event: 'redo' } }));
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getDownloadMenu() {
    return {
      id: "download",
      content: "Download",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        this.store.dispatch(retrievedMapContextMenu({ data: { event: 'download' } }));
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getLockAllMenu(cy: any) {
    return {
      id: "lock_all",
      content: "Lock All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().forEach((ele: any) => {
          const d = ele.data();
          if (d.elem_category != 'group') {
            ele.lock();
            d.locked = true;
            if (!d.new) {
                d.new = false;
                d.updated = true;
                d.deleted = false;
            }
            this.helpersService.addBadge(cy, ele);
          }
        });
        this.toastr.success("Locked all nodes");
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getUnlockAllMenu(cy: any) {
    return {
      id: "unlock_all",
      content: "Unlock All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().forEach((ele: any) => {
          const d = ele.data();
          if (d.elem_category != 'group') {
            ele.unlock();
            d.locked = false;
            if (!d.new) {
                d.new = false;
                d.updated = true;
                d.deleted = false;
            }
            this.helpersService.removeBadge(ele);
          }
        });
        this.toastr.success("Unlocked all nodes");
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getSelectAllMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "select_all",
      content: "Select All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().selectify();
        cy.edges().selectify();
        this.store.dispatch(selectAllNode());
        this.store.dispatch(selectAllPG());
        this.store.dispatch(selectAllInterface());
        this.store.dispatch(selectAllGroup());
        cy.nodes().select();
        cy.edges().select();
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getDeselectAllMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "deselect_all",
      content: "Deselect All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().selectify();
        cy.edges().selectify();
        activeNodes.splice(0);
        activeGBs.splice(0)
        activePGs.splice(0);
        activeEdges.splice(0);
        activeMBs.splice(0);
        activeMapLinks.splice(0);
        this.store.dispatch(unSelectAllNode());
        this.store.dispatch(unselectAllPG());
        this.store.dispatch(unselectAllInterface());
        this.store.dispatch(unSelectAllGroup());
        cy.nodes().unselect();
        cy.edges().unselect();
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}

