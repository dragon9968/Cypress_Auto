import { createReducer, on } from "@ngrx/store";
import { UserState } from "./user.state";
import { retrievedUser } from "./user.actions";

const initialState = {} as UserState;

export const userReducer = createReducer(
  initialState,
  on(retrievedUser, (state, {data}) => ({
    ...state,
    user: data
  }))
)
