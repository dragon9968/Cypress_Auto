import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedNameNodeBySourceNode, retrievedNodes, nodesLoadedSuccess, selectNode, unSelectNode, nodeUpdatedSuccess, removeNode } from "./node.actions";
import { environment } from "src/environments/environment";

const initialState = {} as NodeState;

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
      if (!node.infrastructure) {
        logicalNodes.push(
          { ...node, 
            node_id: node.id, 
            id: `node-${node.id}`,
            data: { ...node, ...baseCyData, ...node.logical_map?.map_style },
            position: node.logical_map?.position,
            locked: node.logical_map?.locked 
          }
        );
        if (node.category === 'hw') {
          physicalNodes.push(
            { ...node, 
              node_id: node.id, 
              id: `node-${node.id}`,
              data: { ...node, ...baseCyData, ...node.physical?.map_style },
              position: node.physical?.position,
              locked: node.physical?.locked 
            }
          );
        }
      } else {
        physicalNodes.push(
          { ...node, 
            node_id: node.id, 
            id: `node-${node.id}`,
            data: { ...node, ...baseCyData, ...node.physical?.map_style },
            position: node.physical?.position,
            locked: node.physical?.locked 
          }
        );
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
    const logicalNodes = state.logicalNodes.filter(ele => ele.node_id !== id);
    return {
      ...state,
      logicalNodes
    };
  }),
  on(nodeUpdatedSuccess, (state, { node }) => {
    const cyNode = {
      ...node,
      node_id: node.id, 
      id: `node-${node.id}`,
    }
    const logicalNodes = state.logicalNodes.map((n: any) => (n.node_id == cyNode.node_id) ? { ...n, ...cyNode } : n);
    return {
      ...state,
      logicalNodes,
    };
  }),
)
