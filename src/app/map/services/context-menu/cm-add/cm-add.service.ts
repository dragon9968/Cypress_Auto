import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class CMAddService {

  constructor(private dialog: MatDialog) { }

  getNodeAddMenu(queueEdge: Function) {
    const addInterface = {
      id: "add_interface",
      content: "Add Interface",
      onClickFunction: (event: any) => {
        queueEdge(event.target, event.position, "wired");
      },
      hasTrailingDivider: true,
      disabled: false,
    }
    const addConfigFile = {
      id: "add_config_file",
      content: "Add Config File",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
    const addFWRule = {
      id: "add_fw_rule",
      content: "Add FW Rule",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
    const addRouteNode = {
      id: "add_route_node",
      content: "Add Route",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
    const addRolesService = {
      id: "add_roles_service",
      content: "Add Roles & Service",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
    const addDomainMembership = {
      id: "add_domain_membership",
      content: "Add Domain Membership",
      onClickFunction: (event: any) => { },
      hasTrailingDivider: true,
      disabled: false,
    }
    return {
      id: "node_add",
      content: "Add",
      selector: "node[icon]",
      hasTrailingDivider: false,
      submenu: [
        addInterface,
        addConfigFile,
        addFWRule,
        addRouteNode,
        addRolesService,
        addDomainMembership
      ]
    }
  }

  getPortGroupAddMenu() {
    return {
      id: "pg_add",
      content: "Add",
      selector: "node[elem_category='port_group']",
      hasTrailingDivider: false,
      submenu: [
        {
          id: "add_interface",
          content: "Add Interface",
          selector: "node[label!='group_box']",
          onClickFunction: (event: any) => {},
          hasTrailingDivider: true,
          disabled: false,
        },
      ]
    }
  }

  getEdgeAddMenu() {
    return {
      id: "edge_add",
      content: "Add",
      selector: "edge",
      hasTrailingDivider: false,
      disabled: false,
      submenu: [
        {
          id: "add_protocol",
          content: "Add Protocol",
          onClickFunction: (event: any) => { },
          hasTrailingDivider: false,
          disabled: false,
        },
      ]
    }
  }
}
