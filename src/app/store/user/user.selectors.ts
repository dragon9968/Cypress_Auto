import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectUserFeature = createFeatureSelector<UserState>(ReducerKeys.USERS);
export const selectUser = createSelector(selectUserFeature, (state: UserState) => state.user);
export const selectRole = createSelector(selectUserFeature, (state: UserState) => state.role);
