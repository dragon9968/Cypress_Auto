import { createAction, props } from "@ngrx/store";

export const retrievedInterfacesManagement = createAction(
  'retrievedInterfacesManagement',
  props<{data: any}>()
);

export const retrievedInterfacesNotConnectPG = createAction(
  'retrievedInterfacesNotConnectPG',
  props<{ interfacesNotConnectPG: any }>()
);

export const retrievedInterfaceIdConnectPG = createAction(
  'retrievedInterfaceIdConnectPG',
  props<{ interfaceIdConnectPG: any }>()
);
