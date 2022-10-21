import { createAction, props } from "@ngrx/store";

export const retrievedDeviceCategories = createAction(
  'retrievedDeviceCategories',
  props<{data: any}>()
)
