import { createFeatureSelector, createSelector } from "@ngrx/store";
import { NodeState } from "./node.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectNodeFeature = createFeatureSelector<NodeState>(ReducerKeys.NODE);
export const selectNodesByCollectionId = createSelector(selectNodeFeature, (state: NodeState) => state.nodes);
