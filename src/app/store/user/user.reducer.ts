import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { retrievedPermissions, retrievedRoles, retrievedUsers } from "./user.actions";

const initialState = {} as UserState;

export const userReducer = createReducer(
  initialState,
  on(retrievedUsers, (state, { users }) => ({
    ...state,
    users
  })),
  on(retrievedRoles, (state, { roles }) => ({
    ...state,
    roles
  })),
  on(retrievedPermissions, (state, { permissions }) => ({
    ...state,
    permissions
  })),
)
