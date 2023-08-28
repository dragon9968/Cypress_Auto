import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectUserFeature = createFeatureSelector<UserState>(ReducerKeys.USERS);
export const selectUsers = createSelector(selectUserFeature, (state: UserState) => state.users);
export const selectRoles = createSelector(selectUserFeature, (state: UserState) => state.roles);
export const selectPermissions = createSelector(selectUserFeature, (state: UserState) => state.permissions);
