import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { retrievedRole, retrievedUser } from "./user.actions";

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
)
