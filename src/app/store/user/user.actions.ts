import { createAction, props } from "@ngrx/store";

export const retrievedUser = createAction(
  'retrievedUser',
  props<{data: any}>()
)
