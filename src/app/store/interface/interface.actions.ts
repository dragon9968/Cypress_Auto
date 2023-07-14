import { createAction, props } from "@ngrx/store";

export const retrievedInterfaceByProjectIdAndCategory = createAction(
  'retrievedInterfaceByProjectIdAndCategory',
  props<{data: any}>()
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
