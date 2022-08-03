import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMActionsMenuService {

  constructor(private dialog: MatDialog) { }

  getNodeActionsMenu() {
    return {
      id: "node_actions",
      content: "Actions",
      selector: "node[icon]",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "clone_node",
          content: "Clone",
          onClickFunction: (event: any) => {},
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_node",
          content: "Validate",
          onClickFunction: (event: any) => {},
          hasTrailingDivider: true,
          disabled: false,
        },
      ],
      disabled: false,
    }
  }

  getPortGroupActionsMenu() {
    return {
      id: "pg_actions",
      content: "Actions",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "randomize_pg_subnet",
          content: "Randomize Subnet",
          onClickFunction: (event: any) => {},
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_pg",
          content: "Validate",
          onClickFunction: (event: any) => {},
          hasTrailingDivider: true,
          disabled: false,
        },
      ],
      disabled: false,
    }
  }

  getEdgeActionsMenu() {
    return {
      id: "edge_actions",
      content: "Actions",
      selector: "edge",
      hasTrailingDivider: true,
      submenu: [
        {
          id: "add_edge_config",
          content: "Add Configuration",
          selector: "edge",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: true,
        },
        {
          id: "randomize_edge_ip",
          content: "Randomize IP",
          selector: "edge",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
        {
          id: "validate_edge",
          content: "Validate",
          selector: "edge",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
  }
}
