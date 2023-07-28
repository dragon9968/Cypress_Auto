import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedNameNodeBySourceNode,
  retrievedNodes,
  nodesLoadedSuccess,
  selectNode,
  unSelectNode,
  nodeUpdatedSuccess,
  removeNode,
  updateInterfaceInNode,
  nodeAddedSuccess,
  bulkUpdatedNodeSuccess
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
  on(retrievedNodes, (state, { data }) => ({
    ...state,
    logicalNodes: data,
  })),
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
      logicalNodes,
      physicalNodes
    };
  }),
  on(selectNode, (state, { id }) => {
    const logicalNodes = state.logicalNodes.map(n => (n.data.id == id) ? { ...n, isSelected: true } : n);
    return {
      ...state,
      logicalNodes
    }
  }),
  on(unSelectNode, (state, { id }) => {
    const logicalNodes = state.logicalNodes.map(n => (n.data.id == id) ? { ...n, isSelected: false } : n);
    return {
      ...state,
      logicalNodes
    }
  }),
  on(removeNode, (state, { id }) => {
    const logicalNodes = state.logicalNodes.filter(n => n.id !== id);
    return {
      ...state,
      logicalNodes
    };
  }),
  on(nodeAddedSuccess, (state, { newNode }) => {
    const logicalNodes = JSON.parse(JSON.stringify(state.logicalNodes))
    const physicalNodes = JSON.parse(JSON.stringify(state.physicalNodes))
    let cyNode;
    if (!newNode.infrastructure) {
      cyNode = addCYDataToNode(newNode, true);
      logicalNodes.push(cyNode);
      if (newNode.category === 'hw') {
        cyNode = addCYDataToNode(newNode, false);
        physicalNodes.push(cyNode);
      }
    } else {
      cyNode = addCYDataToNode(newNode, false);
      physicalNodes.push(cyNode);
    }
    return {
      ...state,
      logicalNodes: logicalNodes,
      physicalNodes: physicalNodes
    };
  }),
  on(nodeUpdatedSuccess, (state, { node }) => {
    const logicalNodes = state.logicalNodes.map((n: any) => (n.id == node.id) ? { ...n, ...node } : n);
    return {
      ...state,
      logicalNodes,
    };
  }),

  on(bulkUpdatedNodeSuccess, (state, { nodes }) => {
    let newNodes = [...state.logicalNodes];
    nodes.map((node: any) => {
      newNodes = newNodes.map((n: any) => (n.id == node.id) ? { ...n, ...node } : n);
    })
    return {
      ...state,
      logicalNodes: newNodes,
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
      logicalNodes,
    };
  }),
)

