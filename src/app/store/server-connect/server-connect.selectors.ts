import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ServerConnectState } from "./server-connect.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectServerConnectsFeature = createFeatureSelector<ServerConnectState>(ReducerKeys.SERVER_CONNECT);
export const selectServerConnects = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.serverConnects);
export const selectIsConnect = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.isConnect);
