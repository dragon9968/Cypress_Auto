import { createReducer, on } from "@ngrx/store";
import { retrievedIsDeviceChange } from "./device-change.actions";

const initialState = {} as any;
export const deviceChangeReducer = createReducer(
  initialState,
  on(retrievedIsDeviceChange, (state, { data }) => ({
    ...state,
    isDeviceChange: data
  }))
)
