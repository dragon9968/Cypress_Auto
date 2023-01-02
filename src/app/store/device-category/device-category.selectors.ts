import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ReducerKeys } from "../reducer-keys.enum";
import { DeviceCategoryState } from "./device-category.state";

export const selectDeviceCategoryFeature = createFeatureSelector<DeviceCategoryState>(ReducerKeys.DEVICE_CATEGORY);
export const selectDeviceCategories = createSelector(selectDeviceCategoryFeature, (state: DeviceCategoryState) => state.deviceCategories);
