import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedInterfacesManagement,
  retrievedInterfacesNotConnectPG,
  retrievedInterfacePkConnectPG
} from "./interface.actions";

const initialState = {} as InterfaceState;

export const interfaceReducerByIds = createReducer(
  initialState,
  on(retrievedInterfacesManagement, (state, { data }) => ({
    ...state,
    interfacesManagement: data
  })),
  on(retrievedInterfacesNotConnectPG, (state, { interfacesNotConnectPG }) => ({
    ...state,
    interfacesNotConnectPG: interfacesNotConnectPG
  })),
  on(retrievedInterfacePkConnectPG, (state, { interfacePkConnectPG }) => ({
    ...state,
    interfacePkConnectPG: interfacePkConnectPG
  }))
);
