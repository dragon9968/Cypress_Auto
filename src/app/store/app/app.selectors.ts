import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AppState } from "./app.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectAppFeature = createFeatureSelector<AppState>(ReducerKeys.APP);
export const selectNotification = createSelector(selectAppFeature, (state: AppState) => state.notification);
