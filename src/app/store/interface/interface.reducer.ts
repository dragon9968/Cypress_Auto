import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedInterfacesNotConnectPG,
  retrievedIsInterfaceConnectPG,
  retrievedInterfaceByProjectIdAndCategory,
  retrievedInterfacesConnectedPG,
  retrievedInterfacesBySourceNode,
  retrievedInterfacePkConnectNode,
  retrievedInterfacesByHwNodes,
  retrievedInterfacesByDestinationNode,
  retrievedInterfacesConnectedNode
} from "./interface.actions";

const initialState = {} as InterfaceState;

export const interfaceReducerByIds = createReducer(
  initialState,
  on(retrievedInterfaceByProjectIdAndCategory, (state, { data }) => ({
    ...state,
    interfacesByProjectIdAndCategory: data
  })),
  on(retrievedInterfacesNotConnectPG, (state, { interfacesNotConnectPG }) => ({
    ...state,
    interfacesNotConnectPG: interfacesNotConnectPG
  })),
  on(retrievedInterfacesConnectedPG, (state, { interfacesConnectedPG }) => ({
    ...state,
    interfacesConnectedPG: interfacesConnectedPG
  })),
  on(retrievedIsInterfaceConnectPG, (state, { isInterfaceConnectPG }) => ({
    ...state,
    isInterfaceConnectPG: isInterfaceConnectPG
  })),
  on(retrievedInterfacePkConnectNode, (state, { interfacePkConnectNode }) => ({
    ...state,
    interfacePkConnectNode: interfacePkConnectNode
  })),
  on(retrievedInterfacesBySourceNode, (state, { interfacesBySourceNode }) => ({
    ...state,
    interfacesBySourceNode: interfacesBySourceNode
  })),
  on(retrievedInterfacesByDestinationNode, (state, { interfacesByDestinationNode }) => ({
    ...state,
    interfacesByDestinationNode: interfacesByDestinationNode
  })),
  on(retrievedInterfacesByHwNodes, (state, { interfacesByHwNodes }) => ({
    ...state,
    interfacesByHwNodes: interfacesByHwNodes
  })),
  on(retrievedInterfacesConnectedNode, (state, { interfacesConnectedNode }) => ({
    ...state,
    interfacesConnectedNode: interfacesConnectedNode
  })),
);
