import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedNode } from "./node.actions";

const initialState = {} as NodeState;

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNode, (state, { data }) => ({
    ...state,
    nodes: data,
  }))
)
