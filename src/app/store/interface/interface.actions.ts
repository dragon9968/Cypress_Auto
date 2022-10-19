import { createAction, props } from "@ngrx/store";

export const retrievedInterfacesByIds = createAction(
  'retrievedInterfacesByIds',
  props<{data: any}>()
);
