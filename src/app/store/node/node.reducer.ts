import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedNameNodeBySourceNode,
  nodesLoadedSuccess,
  selectNode,
  unSelectNode,
  nodeUpdatedSuccess,
  updateInterfaceInNode,
  nodeAddedSuccess,
  bulkUpdatedNodeSuccess,
  updateDomainInNode,
  selectAllNode,
  unSelectAllNode,
  linkedMapNodesLoadedSuccess,
  clearLinkedMapNodes,
  bulkUpdateInterfaceInNode,
  removeNodesSuccess,
  restoreNodesSuccess,
  addInterfaceInNode
} from "./node.actions";
import { environment } from "src/environments/environment";

const initialState = {} as NodeState;

const addCYDataToNode = (node: any, isLogicalNode: boolean) => {
  let icon;
  if (node.icon) {
    icon = `/static/img/uploads/${node.icon.photo}`
  } else if (node.device && node.device.icon) {
    icon = `/static/img/uploads/${node.device.icon.photo}`;
  } else if (node.template && node.template.icon) {
    icon = `/static/img/uploads/${node.template.icon.photo}`;
  } else {
    icon = "/static/img/icons/default_icon.png";
  }
  const baseCyData = {
    id: `node-${node.id}`,
    node_id: node.id,
    elem_category: "node",
    layout: { name: "preset" },
    zIndex: 999,
    updated: false,
    in_groupbox: false,
    url: "",
    login_profile: node.login_profile,
    login_profile_show: "",
    configuration_show: "",
    notes: node.notes,
    groups: node.groups,
    interfaces: node.interfaces,
    icon: !icon.includes(environment.apiBaseUrl) ? environment.apiBaseUrl + icon : icon,
    infrastructure: node.infrastructure
  }
  if (isLogicalNode) {
    return {
      ...node,
      data: { ...node, ...baseCyData, ...node.logical_map?.map_style },
      position: node.logical_map?.position,
      locked: node.logical_map?.locked
    };
  } else {
    return {
      ...node,
      data: { ...node, ...baseCyData, ...node.physical?.map_style },
      position: node.physical?.position,
      locked: node.physical?.locked
    }
  }
}

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNameNodeBySourceNode, (state, { nameNode }) => ({
    ...state,
    nameNode
  })),
  on(nodesLoadedSuccess, (state, { nodes }) => {
    const logicalNodes: any = [];
    const physicalNodes: any = [];
    nodes.map((node: any) => {
      let cyNode;
      if (!node.infrastructure) {
        cyNode = addCYDataToNode(node, true);
        logicalNodes.push(cyNode);
        if (node.category === 'hw') {
          cyNode = addCYDataToNode(node, false);
          physicalNodes.push(cyNode);
        }
      } else {
        cyNode = addCYDataToNode(node, false);
        physicalNodes.push(cyNode);
      }
    })
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
      physicalNodes
    };
  }),
  on(linkedMapNodesLoadedSuccess, (state, { nodes, mapLinkId, position }) => {
    const linkedMapNodes = JSON.parse(JSON.stringify(nodes)).map((node: any) => {
      let nodeCY = addCYDataToNode(node, true)
      nodeCY.data.parent_id = mapLinkId
      if (nodeCY.position) {
        nodeCY.position.x += position.x
        nodeCY.position.y += position.y
      }
      return nodeCY;
    })
    return {
      ...state,
      linkedMapNodes
    };
  }),
  on(clearLinkedMapNodes, (state) => {
    return {
      ...state,
      linkedMapNodes: undefined
    }
  }),
  on(selectNode, (state, { id }) => {
    const logicalNodes = state.logicalNodes.map(n => (n.data.id == id) ? { ...n, isSelected: true } : n);
    return {
      ...state,
      isSelectedFlag: true,
      logicalNodes,
    }
  }),
  on(unSelectNode, (state, { id }) => {
    const logicalNodes = state.logicalNodes.map(n => (n.data.id == id) ? { ...n, isSelected: false } : n);
    return {
      ...state,
      isSelectedFlag: true,
      logicalNodes,
    }
  }),
  on(removeNodesSuccess, (state, { ids }) => {
    const logicalNodes = state.logicalNodes.map(n => ids.includes(n.id) ? { ...n, isDeleted: true } : n);
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),
  on(restoreNodesSuccess, (state, { ids }) => {
    const logicalNodes = state.logicalNodes.map(n => ids.includes(n.id) ? { ...n, isDeleted: false } : n);
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),
  on(nodeAddedSuccess, (state, { node }) => {
    const logicalNodes = JSON.parse(JSON.stringify(state.logicalNodes))
    const physicalNodes = JSON.parse(JSON.stringify(state.physicalNodes))
    let cyNode;
    if (!node.infrastructure) {
      cyNode = addCYDataToNode(node, true);
      logicalNodes.push(cyNode);
      if (node.category === 'hw') {
        cyNode = addCYDataToNode(node, false);
        physicalNodes.push(cyNode);
      }
    } else {
      cyNode = addCYDataToNode(node, false);
      physicalNodes.push(cyNode);
    }
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
      physicalNodes
    };
  }),
  on(nodeUpdatedSuccess, (state, { node }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => (n.id == node.id) ? { ...n, ...node } : n);
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),
  on(bulkUpdatedNodeSuccess, (state, { nodes }) => {
    const logicalNodes = state.logicalNodes.map((node: any) => {
      const updatedNode = nodes.find((n: any) => n.id == node.id);
      return updatedNode ? { ...node, ...updatedNode } : node
    });
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),

  on(updateInterfaceInNode, (state, { interfaceData }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => {
      if (interfaceData.node_id == n.id) {
        const newEdge = {
          id: interfaceData.id,
          value: `${interfaceData.name} - ${interfaceData.ip + interfaceData.netmaskName}`
        }
        const interfaces = n.interfaces.map((i: any) => {
          return (i.id == newEdge.id) ? newEdge : i;
        })
        return {
          ...n,
          interfaces
        };
      } else {
        return n;
      }
    });
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),
  on(addInterfaceInNode, (state, { interfaceData }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => {
      if (interfaceData.node_id == n.id) {
        const newEdge = {
          id: interfaceData.id,
          value: interfaceData.netmaskName
            ? `${interfaceData.name} - ${interfaceData.ip + interfaceData.netmaskName}`
            : interfaceData.name
        }
        const interfaces = n.interfaces ? [...n.interfaces, newEdge] : [newEdge]
        return {
          ...n,
          interfaces
        };
      } else {
        return n;
      }
    });
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    }
  }),
  on(bulkUpdateInterfaceInNode, (state, { interfacesData }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => {
      const updatedLogicalInterfaceInNode = interfacesData.interfacesData.find((i: any) => i.node_id == n.id);
      if (updatedLogicalInterfaceInNode) {
        const netmaskName = interfacesData.netmasks.filter((option: any) => option.id == updatedLogicalInterfaceInNode.netmask_id)[0];
        const newEdge = {
          id: updatedLogicalInterfaceInNode.id,
          value: `${updatedLogicalInterfaceInNode.name} - ${updatedLogicalInterfaceInNode.ip + netmaskName.name}`
        }
        const interfaces = n.interfaces.map((i: any) => {
          return (i.id == newEdge.id) ? newEdge : i;
        })
        return {...n, interfaces}
      } else {
        return n
      }
    })
    return {
      ...state,
      logicalNodes,
    };
  }),
  on(updateDomainInNode, (state, { domain }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => {
      if (domain.id == n.domain_id) {
        return {
          ...n,
          domain
        };
      } else {
        return n;
      }
    });
    return {
      ...state,
      isSelectedFlag: false,
      logicalNodes,
    };
  }),
  on(selectAllNode, (state, { }) => {
    const logicalNodes = state.logicalNodes.map(n => ({ ...n, isSelected: true }));
    return {
      ...state,
      isSelectedFlag: true,
      logicalNodes
    }
  }),
  on(unSelectAllNode, (state, { }) => {
    const logicalNodes = state.logicalNodes.map(n => ({ ...n, isSelected: false }));
    return {
      ...state,
      isSelectedFlag: true,
      logicalNodes
    }
  }),
)

