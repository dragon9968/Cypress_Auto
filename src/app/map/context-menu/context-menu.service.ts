import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  constructor() { }

  showContextMenu(cy: any, activeNodes: any[], activePGs: any[], activeEdges: any[], activeGBs: any[], activeMBs: any[],
                  connectionId: any, isTemplateCategory: any) {
    const contextMenu = cy.contextMenus('get');
    const activeNodesLength = activeNodes.length;
    const activePGsLength = activePGs.length;
    const activeEdgesLength = activeEdges.length;
    const activeGBsLength = activeGBs.length;
    const activeMBsLength = activeMBs.length;
    // contextMenu.hideMenuItem('node_add');
    contextMenu.hideMenuItem('node_interface');
    contextMenu.hideMenuItem('link_project');
    // contextMenu.hideMenuItem('pg_add');
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
    if (activeGBsLength > 0) {
      contextMenu.showMenuItem('move_to_front');
      contextMenu.showMenuItem('move_to_back');
      contextMenu.showMenuItem('collapse_groupbox');
      contextMenu.showMenuItem('expand_groupbox');
    } else if (activeMBsLength > 0) {
      contextMenu.showMenuItem('delete');
      contextMenu.showMenuItem('lock_node');
      contextMenu.showMenuItem('unlock_node');
      if (activeNodesLength == 0 && activePGsLength == 0 && activeEdgesLength == 0) {
        contextMenu.showMenuItem('move_to_front');
        contextMenu.showMenuItem('move_to_back');
      } else {
        contextMenu.showMenuItem('delete');
      }
    } else if (activeNodesLength > 0) {
      contextMenu.showMenuItem('delete');
      contextMenu.showMenuItem('lock_node');
      contextMenu.showMenuItem('unlock_node');
      const nodeData = activeNodes[0].data()
      if (nodeData.category === 'project' && activeNodesLength == 1) {
        contextMenu.showMenuItem('link_project');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('collapse_node');
        contextMenu.showMenuItem('expand_node');
      } else {
        if (activePGsLength == 0 && activeEdgesLength == 0) {
          if (activeNodesLength > 1) {
            contextMenu.showMenuItem('node_actions');
            contextMenu.showMenuItem('edit');
            contextMenu.showMenuItem('node_remote');
            contextMenu.hideMenuItem('web_console');
          } else if (activeNodesLength == 1) {
            // contextMenu.showMenuItem('node_add');
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
        }
      }
    } else if (activePGsLength > 0) {
      contextMenu.showMenuItem('delete');
      contextMenu.showMenuItem('lock_node');
      contextMenu.showMenuItem('unlock_node');
      if (activeNodesLength == 0 && activeEdgesLength == 0) {
        if (activePGsLength > 1) {
          contextMenu.showMenuItem('pg_actions');
          contextMenu.showMenuItem('edit');
          contextMenu.showMenuItem('pg_remote');
        } else if (activePGsLength == 1) {
          // contextMenu.showMenuItem('pg_add');
          contextMenu.showMenuItem('pg_interface');
          contextMenu.showMenuItem('pg_actions');
          contextMenu.showMenuItem('view_details');
          contextMenu.showMenuItem('edit');
          contextMenu.showMenuItem('pg_remote');
        }
      } else if (activeEdgesLength > 0) {
        contextMenu.hideMenuItem('lock_node');
        contextMenu.hideMenuItem('unlock_node');
      }
    } else if (activeEdgesLength > 0) {
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
    if (!connectionId || connectionId == 0 || isTemplateCategory) {
      contextMenu.hideMenuItem('node_remote');
      contextMenu.hideMenuItem('pg_remote');
    }
  }

}
