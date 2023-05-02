import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { HelpersService } from 'src/app/core/services/helpers/helpers.service';
import { retrievedMapContextMenu } from 'src/app/store/map-context-menu/map-context-menu.actions';
import { retrievedMapSelection } from 'src/app/store/map-selection/map-selection.actions';

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

  getSelectAllMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[], activeMapLinks: any[]) {
    return {
      id: "select_all",
      content: "Select All",
      coreAsWell: true,
      onClickFunction: (event: any) => {
        const allNodes = cy.nodes();
        const allEdges = cy.edges();
        cy.nodes().selectify();
        cy.edges().selectify();
        const activeEles = activeNodes.concat(activePGs, activeEdges);
        if (activeEles.length == 0) {
          activeNodes.splice(0);
          activePGs.splice(0);
          activeEdges.splice(0);
          activeGBs.splice(0);
        }
        const allNodeAndEdges = allNodes.merge(allEdges)
        allNodeAndEdges.forEach((node: any) => {
          const d = node.data();
          if (d.elem_category == 'node' && !activeNodes.includes(node)) {
            activeNodes.push(node);
          } else if (d.elem_category == 'port_group' && !activePGs.includes(node)) {
            activePGs.push(node);
          } else if (node.isEdge() && !activeEdges.includes(node)) {
            activeEdges.push(node);
          } else if (d.label == 'group_box' && !activeGBs.includes(node)) {
            activeGBs.push(node)
          } else if (d.label == 'map_background' && !activeMBs.includes(node)) {
            activeMBs.push(node)
          } else if (d.elem_category == 'map_link' && !activeMapLinks.includes(node)) {
            activeMapLinks.push(node);
          }
        })
        cy.nodes().select();
        cy.edges().select();
        this.store.dispatch(retrievedMapSelection({ data: true }));
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
        cy.nodes().unselect();
        cy.edges().unselect();
      this.store.dispatch(retrievedMapSelection({ data: true }));
      },
      hasTrailingDivider: false,
      disabled: false,
    }
  }
}

