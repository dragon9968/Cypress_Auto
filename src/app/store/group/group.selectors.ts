import { createFeatureSelector, createSelector } from "@ngrx/store";
import { GroupState } from "./group.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectGroupFeature = createFeatureSelector<GroupState>(ReducerKeys.GROUP);
export const selectGroups = createSelector(selectGroupFeature, (state: GroupState) => state.groups);
