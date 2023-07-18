import { NodeState } from "./node.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedNameNodeBySourceNode, retrievedNodes } from "./node.actions";

const initialState = {} as NodeState;

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNodes, (state, { data }) => ({
    ...state,
    nodes: data,
  })),
  on(retrievedNameNodeBySourceNode, (state, { nameNode }) => ({
    ...state,
    nameNode: nameNode
  })),
)
