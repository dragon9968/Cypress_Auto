import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MapLinkState } from "./map-link.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectMapLinkFeature = createFeatureSelector<MapLinkState>(ReducerKeys.MAP_LINK);
export const selectMapLinks = createSelector(selectMapLinkFeature,
  (state: MapLinkState) => state.mapLinks?.filter(mapLink => !mapLink.isDeleted)
);
export const selectSelectedMapLinks = createSelector(
  selectMapLinks,(mapLinks) => mapLinks?.filter(ml => ml.isSelected)
);

export const selectDeletedMapLinks = createSelector(selectMapLinkFeature, (state: MapLinkState) =>
  state.mapLinks?.filter(mapLink => mapLink.isDeleted)
)
