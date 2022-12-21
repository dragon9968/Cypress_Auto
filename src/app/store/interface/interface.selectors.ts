import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InterfaceState } from "./interface.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectInterfaceFeature = createFeatureSelector<InterfaceState>(ReducerKeys.INTERFACE);
export const selectInterfaceByIds = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfaces);
export const selectInterfacesManagement = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesManagement);

