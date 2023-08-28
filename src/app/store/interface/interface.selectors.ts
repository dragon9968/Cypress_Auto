import { createFeatureSelector, createSelector } from "@ngrx/store";
import { InterfaceState } from "./interface.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectInterfaceFeature = createFeatureSelector<InterfaceState>(ReducerKeys.INTERFACE);
export const selectInterfacesNotConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesNotConnectPG);
export const selectInterfacesConnectedPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesConnectedPG);
export const selectIsInterfaceConnectPG = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.isInterfaceConnectPG);
export const selectInterfacePkConnectNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacePkConnectNode);
export const selectInterfacesBySourceNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesBySourceNode);
export const selectInterfacesByDestinationNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByDestinationNode);
export const selectInterfacesByHwNodes = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesByHwNodes);
export const selectInterfacesConnectedNode = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesConnectedNode);
export const selectLogicalMapInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalMapInterfaces?.filter(i => !i.isDeleted));
export const selectLogicalManagementInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalManagementInterfaces?.filter(i => !i.isDeleted));
export const selectLogicalInterfaces = createSelector(
  selectLogicalMapInterfaces,
  selectLogicalManagementInterfaces,
  (
    selectLogicalMapInterfaces,
    selectLogicalManagementInterfaces
  ) => (selectLogicalMapInterfaces?.concat(selectLogicalManagementInterfaces))
);
export const selectPhysicalInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.physicalInterfaces?.filter(i => !i.isDeleted));
export const selectPhysicalManagementInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.physicalManagementInterfaces?.filter(i => !i.isDeleted));
export const selectLinkedMapInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.linkedMapInterfaces);
export const selectInterfacesCommonMapLinks = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.interfacesCommonMapLinks);
export const selectSelectedLogicalInterfaces = createSelector(selectLogicalInterfaces, (selectLogicalInterfaces) => selectLogicalInterfaces?.filter(i => i.isSelected));
export const selectSelectedPhysicalInterfaces = createSelector(selectPhysicalInterfaces, (selectPhysicalInterfaces) => selectPhysicalInterfaces?.filter(i => i.isSelected));
export const selectIsSelectedFlag = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.isSelectedFlag);
export const selectDeletedLogicalMapInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalMapInterfaces?.filter(i => i.isDeleted));
export const selectDeletedPhysicalInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.physicalInterfaces?.filter(i => i.isDeleted));
export const selectDeletedLogicalManagementInterfaces = createSelector(selectInterfaceFeature, (state: InterfaceState) => state.logicalManagementInterfaces?.filter(i => i.isDeleted));
export const selectDeletedLogicalInterfaces = createSelector(
  selectDeletedLogicalMapInterfaces,
  selectDeletedLogicalManagementInterfaces,
  (
    selectDeletedLogicalMapInterfaces,
    selectDeletedLogicalManagementInterfaces
  ) => (selectDeletedLogicalMapInterfaces?.concat(selectDeletedLogicalManagementInterfaces))
);