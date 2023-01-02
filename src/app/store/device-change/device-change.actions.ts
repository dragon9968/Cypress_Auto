import { createAction, props } from "@ngrx/store";

export const retrievedIsDeviceChange = createAction(
  'retrievedIsDeviceChange',
  props<{data: any}>()
)
