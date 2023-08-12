import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NodeState } from "./node.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectNodesFeature = createFeatureSelector<NodeState>(ReducerKeys.NODE);
export const selectLogicalNodes = createSelector(selectNodesFeature, (state: NodeState) => state.logicalNodes?.filter(n => !n.isDeleted));
export const selectPhysicalNodes = createSelector(selectNodesFeature, (state: NodeState) => state.physicalNodes?.filter(n => !n.isDeleted));
export const selectSelectedLogicalNodes = createSelector(selectLogicalNodes, (logicalNodes) => logicalNodes?.filter(n => n.isSelected));
export const selectSelectedPhysicalNodes = createSelector(selectPhysicalNodes, (physicalNodes) => physicalNodes?.filter(n => n.isSelected));
export const selectIsSelectedFlag = createSelector(selectNodesFeature, (state: NodeState) => state.isSelectedFlag);
export const selectLinkedMapNodes = createSelector(selectNodesFeature, (state: NodeState) => state.linkedMapNodes);
export const selectDeletedLogicalNodes = createSelector(selectNodesFeature, (state: NodeState) => state.logicalNodes?.filter(n => n.isDeleted));
