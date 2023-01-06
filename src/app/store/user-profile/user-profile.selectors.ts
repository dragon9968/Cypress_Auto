import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserProfileState } from "./user-profile.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectUserProfileFeature = createFeatureSelector<UserProfileState>(ReducerKeys.USER_PROFILE);
export const selectUserProfile = createSelector(selectUserProfileFeature, (state: UserProfileState) => state.userProfile);
