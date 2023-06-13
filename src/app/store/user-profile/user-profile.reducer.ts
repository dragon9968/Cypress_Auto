import { createReducer, on } from "@ngrx/store";
import { UserProfileState } from "./user-profile.state";
import { retrievedUserProfile } from "./user-profile.actions";

const initialState = {} as UserProfileState;

export const userProfileReducer = createReducer(
  initialState,
  on(retrievedUserProfile, (state, {data}) => ({
    ...state,
    userProfile: data
  }))
)
