import { AppState } from "./app.state";
import { createReducer, on } from "@ngrx/store";
import { clearNotification, pushNotification } from "./app.actions";

const initialState = {} as AppState;

export const appReducer = createReducer(
  initialState,
  on(pushNotification, (state, { notification }) => {
    return {
      ...state,
      notification,
    };
  }),
  on(clearNotification, (state) => {
    return {
      ...state,
      notification: undefined,
    };
  }),
)
