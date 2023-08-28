import { createAction, props } from "@ngrx/store";

export const retrievedUsers = createAction(
  'retrievedUsers',
  props<{ users: any }>()
)

export const retrievedRoles = createAction(
  'retrievedRoles',
  props<{ roles: any }>()
)

export const retrievedPermissions = createAction(
  'retrievedPermissions',
  props<{ permissions: any }>()
)
