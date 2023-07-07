import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InterfaceState } from "./interface.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectInterfaceFeature = createFeatureSelector<InterfaceState>(ReducerKeys.INTERFACE);
export const selectInterfacesNotConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesNotConnectPG);
export const selectInterfacePkConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacePkConnectPG);
export const selectInterfacesByProjectIdAndCategory = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByProjectIdAndCategory);


