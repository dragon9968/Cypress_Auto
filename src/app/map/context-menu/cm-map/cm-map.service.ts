import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { selectAllGroup, unSelectAllGroup } from 'src/app/store/group/group.actions';
import { selectAllInterface, unSelectAllInterface } from 'src/app/store/interface/interface.actions';
import { retrievedMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.actions';
import { selectAllNode, unSelectAllNode } from 'src/app/store/node/node.actions';
import { selectAllPG, unselectAllPG } from 'src/app/store/portgroup/portgroup.actions';
import { selectAllElementsOnMap, unSelectAllElementsOnMap } from "../../../store/map/map.actions";

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
            d.updated = true;
            this.helpersService.addBadge(cy, ele);
          }
        });
        this.toastr.success("Locked all elements");
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
            d.updated = true;
            this.helpersService.removeBadge(ele);
          }
        });
        this.toastr.success("Unlocked all elements");
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getSelectAllMenu(cy: any) {
    return {
      id: "select_all",
      content: "Select All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().selectify();
        cy.edges().selectify();
        this.store.dispatch(selectAllElementsOnMap());
        cy.nodes().select();
        cy.edges().select();
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }

  getDeselectAllMenu(cy: any) {
    return {
      id: "deselect_all",
      content: "Deselect All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        cy.nodes().selectify();
        cy.edges().selectify();
        this.store.dispatch(unSelectAllElementsOnMap());
        cy.nodes().unselect();
        cy.edges().unselect();
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}

