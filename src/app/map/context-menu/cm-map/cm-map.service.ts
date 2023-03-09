import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { retrievedMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.actions';

@Injectable({
  providedIn: 'root'
})
export class CMMapService {

  constructor(
    private store: Store,
    private helpersService: HelpersService,
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
        cy.nodes().select();
        cy.edges().select();
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}
