import { createAction, props } from "@ngrx/store";

export const retrievedInterfaceByProjectIdAndCategory = createAction(
  'retrievedInterfaceByProjectIdAndCategory',
  props<{data: any}>()
);

export const retrievedInterfacesNotConnectPG = createAction(
  'retrievedInterfacesNotConnectPG',
  props<{ interfacesNotConnectPG: any }>()
);

export const retrievedInterfacePkConnectPG = createAction(
  'retrievedInterfacePkConnectPG',
  props<{ interfacePkConnectPG: any }>()
);
