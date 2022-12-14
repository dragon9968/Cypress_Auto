import { createAction, props } from "@ngrx/store";

export const retrievedNodes = createAction(
  'retrievedNodes',
  props<{data: any}>()
)
