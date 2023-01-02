import { createAction, props } from "@ngrx/store";

export const retrievedUserTasks = createAction(
  'retrievedUserTasks',
  props<{data: any}>()
)
