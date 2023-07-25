import { createAction, props } from "@ngrx/store";

export const pushNotification = createAction(
  'pushNotification',
  props<{
    notification: {
      type: string,
      message: string
    }
  }>()
);

export const clearNotification = createAction(
  'clearNotification'
);
