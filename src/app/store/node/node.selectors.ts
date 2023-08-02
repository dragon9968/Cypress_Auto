import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NodeState } from "./node.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectNodesFeature = createFeatureSelector<NodeState>(ReducerKeys.NODE);
export const selectNameBySourceNode = createSelector(selectNodesFeature, (state: NodeState) => state.nameNode);
export const selectLogicalNodes = createSelector(selectNodesFeature, (state: NodeState) => state.logicalNodes);
export const selectPhysicalNodes = createSelector(selectNodesFeature, (state: NodeState) => state.physicalNodes);
export const selectLinkedMapNodes = createSelector(selectNodesFeature, (state: NodeState) => state.linkedMapNodes);
