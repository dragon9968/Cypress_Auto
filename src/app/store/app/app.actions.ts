import { createAction, props } from "@ngrx/store";
import { NotificationType } from "../../core/models/common.model";

export const pushNotification = createAction(
  'pushNotification',
  props<{
    notification: {
      type: NotificationType,
      message: string
    }
  }>()
);

export const clearNotification = createAction(
  'clearNotification'
);
