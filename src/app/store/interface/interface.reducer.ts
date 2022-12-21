import { InterfaceState } from "./interface.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedInterfacesByIds, retrievedInterfacesManagement } from "./interface.actions";

const initialState = {} as InterfaceState;

export const interfaceReducerByIds = createReducer(
  initialState,
  on(retrievedInterfacesByIds, (state, { data }) => ({
    ...state,
    interfaces: data
  })),
  on(retrievedInterfacesManagement, (state, { data }) => ({
    ...state,
    interfacesManagement: data
  }))
);
