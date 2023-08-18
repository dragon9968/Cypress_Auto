import { Injectable, OnDestroy } from '@angular/core';
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  selectIsConfiguratorConnect,
  selectIsHypervisorConnect
} from "../../store/server-connect/server-connect.selectors";
import { selectSelectedLogicalNodes, selectSelectedPhysicalNodes } from 'src/app/store/node/node.selectors';
import { selectSelectedPortGroups } from 'src/app/store/portgroup/portgroup.selectors';
import { selectSelectedLogicalInterfaces, selectSelectedPhysicalInterfaces } from 'src/app/store/interface/interface.selectors';
import { selectSelectedGroups } from 'src/app/store/group/group.selectors';
import { selectSelectedMapImages } from 'src/app/store/map-image/map-image.selectors';
import { selectSelectedMapLinks } from 'src/app/store/map-link/map-link.selectors';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService implements OnDestroy {

  selectIsHypervisorConnect$ = new Subscription();
  selectIsConfiguratorConnect$ = new Subscription();
  selectSelectedLogicalNodes$ = new Subscription();
  selectSelectedPortGroups$ = new Subscription();
  selectSelectedLogicalInterfaces$ = new Subscription();
  selectSelectedGroups$ = new Subscription();
  selectSelectedMapImages$ = new Subscription();
  selectSelectedMapLinks$ = new Subscription();
  selectSelectedPhysicalNodes$ = new Subscription();
  selectSelectedPhysicalInterfaces$ = new Subscription();
  selectedNodes: any[] = [];
  selectedLogicalNodes: any[] = [];
  selectedPhysicalNodes: any[] = [];
  selectedPGs: any[] = [];
  selectedInterfaces: any[] = [];
  selectedLogicalInterfaces: any[] = [];
  selectedPhysicalInterfaces: any[] = [];
  selectedGroups: any[] = [];
  selectedMapImages: any[] = [];
  selectedMapLinks: any[] = [];
  isHypervisorConnect = false;
  isConfiguratorConnect = false;
  
  constructor(
    private store: Store
  ) {
    this.selectIsHypervisorConnect$ = this.store.select(selectIsHypervisorConnect).subscribe(isHypervisorConnect => {
      this.isHypervisorConnect = isHypervisorConnect
    });
    this.selectIsConfiguratorConnect$ = this.store.select(selectIsConfiguratorConnect).subscribe(isConfiguratorConnect => {
      this.isConfiguratorConnect = isConfiguratorConnect
    });
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
    this.selectSelectedGroups$ = this.store.select(selectSelectedGroups).subscribe(selectedGroups => {
      if (selectedGroups) {
        this.selectedGroups = selectedGroups;
      }
    });
    this.selectSelectedMapImages$ = this.store.select(selectSelectedMapImages).subscribe(selectedMapImages => {
      if (selectedMapImages) {
        this.selectedMapImages = selectedMapImages;
      }
    });
    this.selectSelectedMapLinks$ = this.store.select(selectSelectedMapLinks).subscribe(selectedMapLinks => {
      if (selectedMapLinks) {
        this.selectedMapLinks = selectedMapLinks;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectIsHypervisorConnect$.unsubscribe();
    this.selectIsConfiguratorConnect$.unsubscribe();
    this.selectSelectedLogicalNodes$.unsubscribe();
    this.selectSelectedPortGroups$.unsubscribe();
    this.selectSelectedLogicalInterfaces$.unsubscribe();
    this.selectSelectedGroups$.unsubscribe();
    this.selectSelectedMapImages$.unsubscribe();
    this.selectSelectedMapLinks$.unsubscribe();
    this.selectSelectedPhysicalNodes$.unsubscribe();
    this.selectSelectedPhysicalInterfaces$.unsubscribe();
  }

  showContextMenu(cy: any, isTemplateCategory: any, isGroupBoxesChecked: boolean, mapCategory: string) {
    const selectedNodes = mapCategory === 'logical' ? this.selectedLogicalNodes : this.selectedPhysicalNodes;
    this.selectedInterfaces = mapCategory === 'logical' ? this.selectedLogicalInterfaces : this.selectedPhysicalInterfaces;
    const selectedNodesLength = selectedNodes.length;
    const selectedPGsLength = this.selectedPGs.length;
    const selectedInterfacesLength = this.selectedInterfaces.length;
    const selectedGroupsLength = this.selectedGroups.length;
    const selectedMapImagesLength = this.selectedMapImages.length;
    const selectedMapLinksLength = this.selectedMapLinks.length;
    const contextMenu = cy.contextMenus('get');
    this.hideAllMenuOptions(contextMenu);
    if (selectedGroupsLength > 0) {
      this.showMenuOptionsForselectedGBs(contextMenu);
    } else if (selectedMapImagesLength > 0) {
      this.showMenuOptionsForselectedMBs(contextMenu, selectedNodesLength, selectedPGsLength, selectedInterfacesLength);
    } else if (selectedNodesLength > 0) {
      this.showMenuOptionsForselectedNodes(contextMenu, selectedNodesLength, selectedPGsLength, selectedInterfacesLength, mapCategory);
    } else if (selectedPGsLength > 0) {
      this.showMenuOptionsForselectedPGs(contextMenu, selectedNodesLength, selectedPGsLength, selectedInterfacesLength);
    } else if (selectedInterfacesLength > 0) {
      this.showMenuOptionsForselectedEdges(contextMenu, selectedNodesLength, selectedPGsLength, selectedInterfacesLength, mapCategory);
    } else if (selectedMapLinksLength > 0) {
      this.showMenuOptionsForselectedMapLinks(contextMenu, selectedMapLinksLength);
    }
    if ((!this.isHypervisorConnect && !this.isConfiguratorConnect) || isTemplateCategory) {
      contextMenu.hideMenuItem('node_remote');
      contextMenu.hideMenuItem('pg_remote');
    }

    if (!isGroupBoxesChecked) {
      contextMenu.hideMenuItem('group');
    }
  }
  showMenuOptionsForselectedMapLinks(contextMenu: any, selectedMapLinksLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    contextMenu.hideMenuItem('group');
    if (selectedMapLinksLength == 1) {
      contextMenu.showMenuItem('link_project');
      contextMenu.showMenuItem('view_details');
      contextMenu.showMenuItem('edit');
      contextMenu.showMenuItem('collapse_node');
      contextMenu.showMenuItem('expand_node');
    }
  }
  showMenuOptionsForselectedEdges(contextMenu: any, selectedNodesLength: number, selectedPGsLength: number, selectedInterfacesLength: number, mapCategory: string) {
    contextMenu.showMenuItem('delete');
    if (selectedNodesLength == 0 && selectedPGsLength == 0) {
      if (selectedInterfacesLength > 1 && mapCategory === 'logical') {
        contextMenu.showMenuItem('edge_actions');
        contextMenu.showMenuItem('edit');
      } else if (selectedInterfacesLength > 1 && mapCategory === 'physical') {
        contextMenu.hideMenuItem('edge_actions');
        contextMenu.hideMenuItem('edit');
      } else if (selectedInterfacesLength == 1 && mapCategory === 'logical') {
        contextMenu.showMenuItem('edge_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
      } else if (selectedInterfacesLength == 1 && mapCategory === 'physical') {
        contextMenu.hideMenuItem('edge_actions');
        contextMenu.hideMenuItem('view_details');
        contextMenu.showMenuItem('edit');
      }
    }
  }
  showMenuOptionsForselectedPGs(contextMenu: any, selectedNodesLength: number, selectedPGsLength: number, selectedInterfacesLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    contextMenu.showMenuItem('group');
    if (selectedNodesLength == 0 && selectedInterfacesLength == 0) {
      if (selectedPGsLength > 1) {
        contextMenu.showMenuItem('pg_actions');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('pg_remote');
      } else if (selectedPGsLength == 1) {
        contextMenu.showMenuItem('pg_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('pg_remote');
      }
    } else if (selectedInterfacesLength > 0) {
      contextMenu.hideMenuItem('lock_node');
      contextMenu.hideMenuItem('unlock_node');
      contextMenu.hideMenuItem('group');
    }
  }
  showMenuOptionsForselectedNodes(contextMenu: any, selectedNodesLength: number, selectedPGsLength: number, selectedInterfacesLength: number, mapCategory: string) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    contextMenu.showMenuItem('group');
    if (selectedPGsLength == 0 && selectedInterfacesLength == 0) {
      if (selectedNodesLength > 1) {
        contextMenu.showMenuItem('node_actions');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('node_remote');
        contextMenu.hideMenuItem('web_console');
      } else if (selectedNodesLength == 1 && mapCategory === 'logical') {
        contextMenu.showMenuItem('node_interface');
        contextMenu.showMenuItem('node_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('node_remote');
        contextMenu.showMenuItem('web_console');
      } else if (selectedNodesLength == 1 && mapCategory === 'physical') {
        contextMenu.showMenuItem('node_interface');
        contextMenu.showMenuItem('node_actions');
        contextMenu.showMenuItem('view_details');
        contextMenu.showMenuItem('edit');
        contextMenu.showMenuItem('node_remote');
        contextMenu.showMenuItem('web_console');
      }
    } else if (selectedInterfacesLength > 0) {
      contextMenu.hideMenuItem('lock_node');
      contextMenu.hideMenuItem('unlock_node');
      contextMenu.hideMenuItem('group');
    }
  }

  showMenuOptionsForselectedMBs(contextMenu: any, selectedNodesLength: number, selectedPGsLength: number, selectedInterfacesLength: number) {
    contextMenu.showMenuItem('delete');
    contextMenu.showMenuItem('lock_node');
    contextMenu.showMenuItem('unlock_node');
    if (selectedNodesLength == 0 && selectedPGsLength == 0 && selectedInterfacesLength == 0) {
      contextMenu.showMenuItem('move_to_front');
      contextMenu.showMenuItem('move_to_back');
    }
  }

  hideAllMenuOptions(contextMenu: any) {
    contextMenu.hideMenuItem('node_interface');
    contextMenu.hideMenuItem('link_project');
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

