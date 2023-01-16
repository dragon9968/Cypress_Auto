import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedInterfacesManagement,
  retrievedInterfacesNotConnectPG,
  retrievedInterfaceIdConnectPG
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
  on(retrievedInterfaceIdConnectPG, (state, { interfaceIdConnectPG }) => ({
    ...state,
    interfaceIdConnectPG: interfaceIdConnectPG
  }))
);
