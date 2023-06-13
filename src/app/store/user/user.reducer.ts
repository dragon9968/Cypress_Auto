import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { retrievedPermissions, retrievedRole, retrievedUser } from "./user.actions";

const initialState = {} as UserState;

export const userReducer = createReducer(
  initialState,
  on(retrievedUser, (state, {data}) => ({
    ...state,
    user: data
  })),
  on(retrievedRole, (state, {role}) => ({
    ...state,
    role: role
  })),
  on(retrievedPermissions, (state, {permissions}) => ({
    ...state,
    permissions: permissions
  })),
)
