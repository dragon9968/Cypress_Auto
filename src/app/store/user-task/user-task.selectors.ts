import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserTaskState } from "./user-task.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectUserTaskFeature = createFeatureSelector<UserTaskState>(ReducerKeys.USER_TASK);
export const selectUserTasks = createSelector(selectUserTaskFeature, (state: UserTaskState) => state.userTasks);
