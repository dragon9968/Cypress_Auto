import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ServerConnectState } from "./server-connect.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectServerConnectFeature = createFeatureSelector<ServerConnectState>(ReducerKeys.SERVER_CONNECT);
export const selectServerConnect = createSelector(selectServerConnectFeature, (state: ServerConnectState) => state.serverConnects);
