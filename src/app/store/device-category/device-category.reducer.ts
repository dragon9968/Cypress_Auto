import { createReducer, on } from "@ngrx/store";
import { DeviceCategoryState } from "./device-category.state";
import { retrievedDeviceCategories } from "./device-category.actions";

const initialState = {} as DeviceCategoryState;

export const deviceCategoryReducer = createReducer(
  initialState,
  on(retrievedDeviceCategories, (state, {data}) => ({
    ...state,
    deviceCategories: data
  }))
)
