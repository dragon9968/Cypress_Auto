import { createAction, props } from "@ngrx/store";

export const retrievedNode = createAction(
  'retrievedNodes',
  props<{data: any}>()
)
