import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedNodes } from "./node.actions";

const initialState = {} as NodeState;

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNodes, (state, { data }) => ({
    ...state,
    nodes: data,
  }))
)
