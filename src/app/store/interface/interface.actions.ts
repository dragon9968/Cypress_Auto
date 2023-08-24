import { createAction, props } from "@ngrx/store";

export const loadInterfaces = createAction(
  'loadInterfaces',
  props<{ projectId: number }>()
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

export const selectPhysicalInterface = createAction(
  'selectPhysicalInterface',
  props<{ id: string }>()
);

export const unSelectPhysicalInterface = createAction(
  'unSelectPhysicalInterface',
  props<{ id: string }>()
);

export const selectAllInterface = createAction(
  'selectAllInterface'
);

export const unSelectAllInterface = createAction(
  'unselectAllInterface'
);

export const removeInterfaces = createAction(
  'removeInterfaces',
  props<{ ids: number[] }>()
);

export const removeConnectedPhysicalInterfaces = createAction(
  'removeConnectedPhysicalInterfaces',
  props<{ 
    ids: any[]
   }>()
)

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

export const addPhysicalInterface = createAction(
  'addPhysicalInterface',
  props<{ data: any, mode: any, netmasks: any[] }>()
)

export const interfaceLogicalMapAddedSuccess = createAction(
  'interfaceLogicalMapAddedMapSuccess',
  props<{ edge: any }>()
)

export const interfacePhysicalMapAddedSuccess = createAction(
  'interfacePhysicalMapAddedSuccess',
  props<{ edge: any }>()
)

export const addInterfacesToSourceNodeOrTargetNode = createAction(
  'addInterfacesToSourceNodeOrTargetNode',
  props<{ edge: any, mode: any }>()
);

export const addInterfaceLogicalToMap = createAction(
  'addInterfaceLogicalToMap',
  props<{ id: any }>()
)

export const addPhysicalInterfaceToMap = createAction(
  'addPhysicalInterfaceToMap',
  props<{ id: any, mode: boolean }>()
)

export const removePhysicalInterfaceOnMap = createAction(
  'removePhysicalInterfaceOnMap',
  props<{ id: any, mode: boolean }>()
)

export const updateConnectedPhysicalInterface = createAction(
  'updateConnectedPhysicalInterface',
  props<{ 
    id: any,
    currentEdgeId: any,
    data: any,
    target: any,
    mode: boolean
   }>()
)

export const connectInterfaceToPG = createAction(
  'connectInterfaceToPG',
  props<{
    id: number,
    data: any,
    netmasks: any[],
  }>()
);

export const connectPhysicalInterfaces = createAction(
  'connectPhysicalInterfaces',
  props<{
    id: number,
    data: any,
    target: number,
  }>()
)

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

export const physicalInterfaceUpdatedSuccess = createAction(
  'physicalInterfaceUpdatedSuccess',
  props<{ interfaceData: any }>()
);

export const bulkUpdatedPhysicalInterfaceSuccess = createAction(
  'bulkUpdatedPhysicalInterfaceSuccess',
  props<{ interfacesData: any }>()
)

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

export const addLogicalInterfacesByNodeId = createAction(
  'addLogicalInterfacesByNodeId',
  props<{ nodeId: number }>()
)

export const logicalInterfacesAddedSuccess = createAction(
  'logicalInterfacesAddedSuccess',
  props<{ edges: any[] }>()
)

export const addInterfacesLogicalToMap = createAction(
  'addInterfacesLogicalToMap',
  props<{ edges: any[] }>()
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
