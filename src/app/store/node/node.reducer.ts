import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedNameNodeBySourceNode, retrievedNodes, nodesLoadedSuccess, selectNode, unSelectNode, removeNode } from "./node.actions";
import { environment } from "src/environments/environment";

const initialState = {} as NodeState;

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNodes, (state, { data }) => ({
    ...state,
    nodes: data,
  })),
  on(retrievedNameNodeBySourceNode, (state, { nameNode }) => ({
    ...state,
    nameNode
  })),
  on(nodesLoadedSuccess, (state, { nodes }) => {
    const n = nodes.map((node: any) => {
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
        icon: !icon.includes(environment.apiBaseUrl) ? environment.apiBaseUrl + icon : icon
      }
      return {
        ...node,
        node_id: node.id,
        id: `node-${node.id}`,
        data: { ...node, ...baseCyData, ...node.logical_map?.map_style },
        position: node.logical_map?.position,
        locked: node.logical_map?.locked
      };
    })
    return {
      ...state,
      nodes: n,
    };
  }),
  on(selectNode, (state, { id }) => {
    const nodes = state.nodes.map(n => {
      if (n.data.id == id) return { ...n, isSelected: true };
      return n;
    })
    return {
      ...state,
      nodes
    }
  }),
  on(unSelectNode, (state, { id }) => {
    const nodes = state.nodes.map(n => {
      if (n.data.id == id) return { ...n, isSelected: false };
      return n;
    })
    return {
      ...state,
      nodes
    }
  }),
  on(removeNode, (state, { id }) => {
    const nodes = state.nodes.filter(ele => ele.node_id !== id);
    return {
      ...state,
      nodes
    }
  }),
)
