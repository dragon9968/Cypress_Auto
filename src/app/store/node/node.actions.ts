import { createAction, props } from "@ngrx/store";

export const retrievedNodes = createAction(
  'retrievedNodes',
  props<{data: any}>()
)

export const retrievedNameNodeBySourceNode = createAction(
  'retrievedNameNodeBySourceNode',
  props<{ nameNode: any }>()
);