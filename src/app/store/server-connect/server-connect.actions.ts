import { createAction, props } from "@ngrx/store";

export const retrievedServerConnect = createAction(
  'retrievedServerConnect',
  props<{data: any}>()
)

export const retrievedIsConnect = createAction(
  'retrievedIsConnect',
  props<{data: any}>()
)
