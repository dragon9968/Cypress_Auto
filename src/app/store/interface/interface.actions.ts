import { createAction, props } from "@ngrx/store";

export const loadInterfaces = createAction(
  'loadInterfaces',
  props<{
    projectId: string,
    mapCategory: string
  }>()
);

export const interfacesLoadedSuccess = createAction(
  'interfacesLoadedSuccess',
  props<{ interfaces: any }>()
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
