import { createAction, props } from "@ngrx/store";

export const retrievedUser = createAction(
  'retrievedUser',
  props<{data: any}>()
)

export const retrievedRole = createAction(
  'retrievedRole',
  props<{role: any}>()
)

export const retrievedPermissions = createAction(
  'retrievedPermissions',
  props<{permissions: any}>()
)
