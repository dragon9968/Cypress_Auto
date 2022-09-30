import { createAction, props } from "@ngrx/store";

export const retrievedGroups = createAction(
  'retrievedGroups',
  props<{data: any}>()
)
