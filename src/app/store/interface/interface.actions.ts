import { createAction, props } from "@ngrx/store";

export const retrievedInterfacesByIds = createAction(
  'retrievedInterfacesByIds',
  props<{data: any}>()
);

export const retrievedInterfacesManagement = createAction(
  'retrievedInterfacesManagement',
  props<{data: any}>()
);
