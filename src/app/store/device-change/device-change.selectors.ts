import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectIsDeviceChangeFeature = createFeatureSelector<any>(ReducerKeys.DEVICE_CHANGE);
export const selectIsDeviceChange = createSelector(selectIsDeviceChangeFeature, (state: any) => state.isDeviceChange);
