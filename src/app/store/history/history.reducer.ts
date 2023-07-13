import { createReducer, on } from '@ngrx/store';
import { HistoryState } from "./history.state";
import { retrievedHistories } from "./history.actions";

const initialState = {} as HistoryState;

export const historyReducer = createReducer(
  initialState,
  on(retrievedHistories, (state, { data }) => ({
    ...state,
    histories: data,
  })),
);
