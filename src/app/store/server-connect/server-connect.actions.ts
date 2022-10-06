import { createAction, props } from "@ngrx/store";

export const retrievedServerConnect = createAction(
  'retrievedServerConnect',
  props<{data: any}>()
)
