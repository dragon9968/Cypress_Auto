import { ServerConnectState } from "./server-connect.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedServerConnect } from "./server-connect.actions";

const initialState = {} as ServerConnectState;

export const serverConnect = createReducer(
  initialState,
  on(retrievedServerConnect, (state, { data }) => ({
    ...state,
    serverConnects: data
  }))
)
