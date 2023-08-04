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

export const retrievedInterfacesNotConnectPG = createAction(
  'retrievedInterfacesNotConnectPG',
  props<{ interfacesNotConnectPG: any }>()
);

export const addInterfacesNotConnectPG = createAction(
  'addInterfacesNotConnectPG',
  props<{ edge: any }>()
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

export const selectAllInterface = createAction(
  'selectAllInterface'
);

export const unselectAllInterface = createAction(
  'unselectAllInterface'
);

export const removeInterfaces = createAction(
  'removeInterfaces',
  props<{ ids: number[] }>()
);

export const removeInterfacesSuccess = createAction(
  'removeInterfaceSuccess',
  props<{ ids: number[] }>()
);

export const restoreInterfaces = createAction(
  'restoreInterfaces',
  props<{ ids: number[] }>()
);

export const restoreInterfacesSuccess = createAction(
  'restoreInterfacesSuccess',
  props<{ ids: number[] }>()
);

export const addLogicalInterface = createAction(
  'addLogicalInterface',
  props<{ edge: any, netmasks: any[] }>()
)

export const interfaceLogicalMapAddedSuccess = createAction(
  'interfaceLogicalMapAddedMapSuccess',
  props<{ edge: any }>()
)

export const addInterfaceLogicalToMap = createAction(
  'addInterfaceLogicalToMap',
  props<{ id: any }>()
)

export const connectInterfaceToPG = createAction(
  'connectInterfaceToPG',
  props<{
    id: number,
    data: any,
    netmasks: any[],
  }>()
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

export const linkedMapInterfacesLoadedSuccess = createAction(
  'linkedMapInterfacesLoadedSuccess',
  props<{ interfaces: any, nodes: any }>()
);

export const clearLinkedMapInterfaces = createAction(
  'clearLinkedMapInterfaces'
)

export const addInterfaceMapLinkToPG = createAction(
  'addInterfaceMapLinkToPG',
  props<{ edge: any }>()
)

export const interfaceAddedMapLinkToPGSuccess = createAction(
  'interfaceAddedMapLinkToPGSuccess',
  props<{ edge: any }>()
)

export const addInterfaceMapLinkToMap = createAction(
  'addInterfaceMapLinkToMap',
  props<{ id: any }>()
)

export const randomizeIpBulk = createAction(
  'randomizeIpBulk',
  props<{
    pks: any,
    netmasks: any[],
  }>()
)

export const randomizeIpBulkSuccess = createAction(
  'randomizeIpBulkSuccess',
  props<{ interfacesData: any }>()
)
