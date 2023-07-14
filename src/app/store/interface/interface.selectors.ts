import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InterfaceState } from "./interface.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectInterfaceFeature = createFeatureSelector<InterfaceState>(ReducerKeys.INTERFACE);
export const selectInterfacesNotConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesNotConnectPG);
export const selectInterfacesConnectedPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesConnectedPG);
export const selectIsInterfaceConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.isInterfaceConnectPG);
export const selectInterfacesByProjectIdAndCategory = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByProjectIdAndCategory);


