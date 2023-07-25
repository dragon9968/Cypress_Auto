import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InterfaceState } from "./interface.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectInterfaceFeature = createFeatureSelector<InterfaceState>(ReducerKeys.INTERFACE);
export const selectInterfacesNotConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesNotConnectPG);
export const selectInterfacesConnectedPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesConnectedPG);
export const selectIsInterfaceConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.isInterfaceConnectPG);
export const selectInterfacesByProjectIdAndCategory = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByProjectIdAndCategory);
export const selectInterfacePkConnectNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacePkConnectNode);
export const selectInterfacesBySourceNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesBySourceNode);
export const selectInterfacesByDestinationNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByDestinationNode);
export const selectInterfacesByHwNodes = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByHwNodes);
export const selectInterfacesConnectedNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesConnectedNode);
export const selectLogicalInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalWiredInterfaces?.concat(state.logicalManagementInterfaces));
export const selectLogicalWiredInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalWiredInterfaces);
export const selectManagementInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalManagementInterfaces);
export const selectPhysicalWiredInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.physicalWiredInterfaces);
export const selectPhysicalManagementInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.physicalManagementInterfaces);



