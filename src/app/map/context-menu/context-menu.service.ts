import { Injectable, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  selectIsConfiguratorConnect,
  selectIsHypervisorConnect
} from "../../store/server-connect/server-connect.selectors";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService implements OnDestroy {

  selectIsHypervisorConnect$ = new Subscription()
  selectIsConfiguratorConnect$ = new Subscription()
  isHypervisorConnect = false;
  isConfiguratorConnect = false;

  constructor(
    private store: Store
  ) {
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      this.isHypervisorConnect = isHypervisorConnect
    })
    this.selectIsConfiguratorConnect$ = this.store.select(selectIsConfiguratorConnect).subscribe(isConfiguratorConnect => {
      this.isConfiguratorConnect = isConfiguratorConnect
    })
  }

  ngOnDestroy(): void {
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectIsConfiguratorConnect$.unsubscribe();
  }

  showContextMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[],
    activeMapLinks: any[], isTemplateCategory: any, isGroupBoxesChecked: boolean) {
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const activeGBsLength = activeGBs.length;
    const activeMBsLength = activeMBs.length;
    const activeMapLinksLength = activeMapLinks.length;
    const contextMenu = cy.contextMenus('get');
    this.hideAllMenuOptions(contextMenu);
    if (activeGBsLength > 0) {
      this.showMenuOptionsForselectedGBs(contextMenu);
    } else if (activeMBsLength > 0) {
      this.showMenuOptionsForselectedMBs(contextMenu, activeNodesLength, activePGsLength, activeEdgesLength);
    } else if (activeNodesLength > 0) {
      this.showMenuOptionsForselectedNodes(contextMenu, activeNodesLength, activePGsLength, activeEdgesLength);
    } else if (activePGsLength > 0) {
      this.showMenuOptionsForselectedPGs(contextMenu, activeNodesLength, activePGsLength, activeEdgesLength);
    } else if (activeEdgesLength > 0) {
      this.showMenuOptionsForselectedEdges(contextMenu, activeNodesLength, activePGsLength, activeEdgesLength);
    } else if (activeMapLinksLength > 0) {
      this.showMenuOptionsForselectedMapLinks(contextMenu, activeMapLinksLength);
    }
    if ((!this.isHypervisorConnect && !this.isConfiguratorConnect) || isTemplateCategory) {
      contextMenu.hideMenuItem('node_remote');
      contextMenu.hideMenuItem('pg_remote');
    }

    if (!isGroupBoxesChecked) {
      contextMenu.hideMenuItem('group');
    }
  }
  showMenuOptionsForselectedMapLinks(contextMenu: any, activeMapLinksLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    if (activeMapLinksLength == 1) {
      contextMenu.showMenuItem('link_project');
      contextMenu.showMenuItem('view_details');
      contextMenu.showMenuItem('edit');
      contextMenu.showMenuItem('collapse_node');
      contextMenu.showMenuItem('expand_node');
    }
  }
  showMenuOptionsForselectedEdges(contextMenu: any, activeNodesLength: number, activePGsLength: number, activeEdgesLength: number) {
    contextMenu.showMenuItem('delete');
    if (activeNodesLength == 0 && activePGsLength == 0) {
      if (activeEdgesLength > 1) {
        contextMenu.showMenuItem('edge_actions');
        contextMenu.showMenuItem('edit');
      } else if (activeEdgesLength == 1) {
        contextMenu.showMenuItem('edge_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
      }
    }
  }
  showMenuOptionsForselectedPGs(contextMenu: any, activeNodesLength: number, activePGsLength: number, activeEdgesLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    contextMenu.showMenuItem('group');
    if (activeNodesLength == 0 && activeEdgesLength == 0) {
      if (activePGsLength > 1) {
        contextMenu.showMenuItem('pg_actions');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('pg_remote');
      } else if (activePGsLength == 1) {
        contextMenu.showMenuItem('pg_interface');
        contextMenu.showMenuItem('pg_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('pg_remote');
      }
    } else if (activeEdgesLength > 0) {
      contextMenu.hideMenuItem('lock_node');
      contextMenu.hideMenuItem('unlock_node');
      contextMenu.hideMenuItem('group');
    }
  }
  showMenuOptionsForselectedNodes(contextMenu: any, activeNodesLength: number, activePGsLength: number, activeEdgesLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    contextMenu.showMenuItem('group');
    if (activePGsLength == 0 && activeEdgesLength == 0) {
      if (activeNodesLength > 1) {
        contextMenu.showMenuItem('node_actions');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('node_remote');
        contextMenu.hideMenuItem('web_console');
      } else if (activeNodesLength == 1) {
        contextMenu.showMenuItem('node_interface');
        contextMenu.showMenuItem('node_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('node_remote');
        contextMenu.showMenuItem('web_console');
      }
    } else if (activeEdgesLength > 0) {
      contextMenu.hideMenuItem('lock_node');
      contextMenu.hideMenuItem('unlock_node');
      contextMenu.hideMenuItem('group');
    }
  }

  showMenuOptionsForselectedMBs(contextMenu: any, activeNodesLength: number, activePGsLength: number, activeEdgesLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    if (activeNodesLength == 0 && activePGsLength == 0 && activeEdgesLength == 0) {
      contextMenu.showMenuItem('move_to_front');
      contextMenu.showMenuItem('move_to_back');
    }
  }

  hideAllMenuOptions(contextMenu: any) {
    contextMenu.hideMenuItem('node_interface');
    contextMenu.hideMenuItem('link_project');
    contextMenu.hideMenuItem('pg_interface');
    contextMenu.hideMenuItem('edge_add');
    contextMenu.hideMenuItem('node_actions');
    contextMenu.hideMenuItem('pg_actions');
    contextMenu.hideMenuItem('edge_actions');
    contextMenu.hideMenuItem('view_details');
    contextMenu.hideMenuItem('edit');
    contextMenu.hideMenuItem('delete');
    contextMenu.hideMenuItem('node_remote');
    contextMenu.hideMenuItem('pg_remote');
    contextMenu.hideMenuItem('move_to_front');
    contextMenu.hideMenuItem('move_to_back');
    contextMenu.hideMenuItem('collapse_groupbox');
    contextMenu.hideMenuItem('expand_groupbox');
    contextMenu.hideMenuItem('lock_node');
    contextMenu.hideMenuItem('unlock_node');
    contextMenu.hideMenuItem('collapse_node');
    contextMenu.hideMenuItem('expand_node');
  }

  showMenuOptionsForselectedGBs(contextMenu: any) {
    contextMenu.showMenuItem('move_to_front');
    contextMenu.showMenuItem('move_to_back');
    contextMenu.showMenuItem('collapse_groupbox');
    contextMenu.showMenuItem('expand_groupbox');
  }
}

