import { createAction, props } from "@ngrx/store";

export const retrievedUserProfile = createAction(
  'retrievedUserProfile',
  props<{data: any}>()
)
