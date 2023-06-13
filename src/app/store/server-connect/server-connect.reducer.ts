import { ServerConnectState } from "./server-connect.state";
import { createReducer, on } from "@ngrx/store";
import {
  retrievedIsConfiguratorConnect,
  retrievedIsHypervisorConnect,
  retrievedIsDatasourceConnect,
  retrievedServerConnect
} from "./server-connect.actions";

const initialState = {} as ServerConnectState;

export const serverConnect = createReducer(
  initialState,
  on(retrievedServerConnect, (state, { data }) => ({
    ...state,
    serverConnects: data
  })),
  on(retrievedIsHypervisorConnect, (state, { data }) => ({
    ...state,
    isHypervisorConnect: data
  })),
  on(retrievedIsDatasourceConnect, (state, { data }) => ({
    ...state,
    isDatasourceConnect: data
  })),
  on(retrievedIsConfiguratorConnect, (state, { data }) => ({
    ...state,
    isConfiguratorConnect: data
  }))
)
