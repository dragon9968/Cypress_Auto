import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NodeState } from "./node.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectNodesFeature = createFeatureSelector<NodeState>(ReducerKeys.NODE);
export const selectNodesByProjectId = createSelector(selectNodesFeature, (state: NodeState) => state.nodes);
export const selectNameBySourceNode = createSelector(selectNodesFeature, (state: NodeState) => state.nameNode);
