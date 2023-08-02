import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MapLinkState } from "./map-link.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectMapLinkFeature = createFeatureSelector<MapLinkState>(ReducerKeys.MAP_LINK);
export const selectMapLinks = createSelector(selectMapLinkFeature, (state: MapLinkState) => state.mapLinks);
export const selectSelectedMapLinks = createSelector(
  selectMapLinkFeature,
  (state: MapLinkState) => state.mapLinks?.filter(ml => ml.isSelected)
);
