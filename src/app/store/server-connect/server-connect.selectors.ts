import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ServerConnectState } from "./server-connect.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectServerConnectsFeature = createFeatureSelector<ServerConnectState>(ReducerKeys.SERVER_CONNECT);
export const selectServerConnects = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.serverConnects);
export const selectIsHypervisorConnect = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.isHypervisorConnect);
export const selectIsDatasourceConnect = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.isDatasourceConnect);
export const selectIsConfiguratorConnect = createSelector(selectServerConnectsFeature, (state: ServerConnectState) => state.isConfiguratorConnect);
