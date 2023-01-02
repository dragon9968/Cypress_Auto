import { GroupState } from "./group.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedGroups } from "./group.actions";

const initialState = {} as GroupState;

export const groupReducer = createReducer(
  initialState,
  on(retrievedGroups, (state, {data}) => ({
    ...state,
    groups: data
  }))
)
