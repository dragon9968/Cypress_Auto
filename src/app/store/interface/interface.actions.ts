import { createAction, props } from "@ngrx/store";

export const loadInterfaces = createAction(
  'loadInterfaces',
  props<{
    projectId: string
  }>()
);

export const interfacesLoadedSuccess = createAction(
  'interfacesLoadedSuccess',
  props<{ interfaces: any, nodes: any }>()
);

export const retrievedInterfaceByProjectIdAndCategory = createAction(
  'retrievedInterfaceByProjectIdAndCategory',
  props<{ data: any }>()
);

export const retrievedInterfacesNotConnectPG = createAction(
  'retrievedInterfacesNotConnectPG',
  props<{ interfacesNotConnectPG: any }>()
);

export const retrievedInterfacesConnectedPG = createAction(
  'retrievedInterfacesConnectedPG',
  props<{ interfacesConnectedPG: any }>()
);

export const retrievedIsInterfaceConnectPG = createAction(
  'retrievedIsInterfaceConnectPG',
  props<{ isInterfaceConnectPG: boolean }>()
);

export const retrievedInterfacePkConnectNode = createAction(
  'retrievedInterfacePkConnectNode',
  props<{ interfacePkConnectNode: any }>()
);

export const retrievedInterfacesBySourceNode = createAction(
  'retrievedInterfacesBySourceNode',
  props<{ interfacesBySourceNode: any }>()
);

export const retrievedInterfacesByDestinationNode = createAction(
  'retrievedInterfacesByDestinationNode',
  props<{ interfacesByDestinationNode: any }>()
);

export const retrievedInterfacesByHwNodes = createAction(
  'retrievedInterfacesByHwNodes',
  props<{ interfacesByHwNodes: any }>()
);

export const retrievedInterfacesConnectedNode = createAction(
  'retrievedInterfacesConnectedNode',
  props<{ interfacesConnectedNode: any }>()
);

export const selectInterface = createAction(
  'selectInterface',
  props<{ id: string }>()
);

export const unSelectInterface = createAction(
  'unSelectInterface',
  props<{ id: string }>()
);

export const removeInterface = createAction(
  'removeInterface',
  props<{ id: string }>()
);

export const updateNodeInInterfaces = createAction(
  'updateNodeInInterface',
  props<{ node: any }>()
);

export const updatePGInInterfaces = createAction(
  'updatePGInInterfaces',
  props<{ portgroup: any }>()
);

export const updateLogicalInterface = createAction(
  'updateLogicalInterface',
  props<{
    id: number,
    data: any,
    netmasks: any[],
  }>()
);

export const bulkEditLogicalInterface = createAction(
  'bulkEditLogicalInterface',
  props<{
    ids: any,
    data: any
  }>()
);

export const logicalInterfaceUpdatedSuccess = createAction(
  'logicalInterfaceUpdatedSuccess',
  props<{ interfaceData: any }>()
);

export const bulkEditlogicalInterfaceSuccess = createAction(
  'bulkEditlogicalInterfaceSuccess',
  props<{ interfacesData: any }>()
);
