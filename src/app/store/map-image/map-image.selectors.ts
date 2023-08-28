import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapImageState } from './map-image.state';

export const selectMapImageFeature = createFeatureSelector<MapImageState>(ReducerKeys.MAP_IMAGE);
export const selectMapImages = createSelector(selectMapImageFeature,
  (state: MapImageState) => state.mapImages?.filter(mi => !mi.isDeleted));

export const selectSelectedMapImages = createSelector(selectMapImages,
  (selectMapImages) => selectMapImages?.filter(mi => mi.isSelected)
);
export const selectImages = createSelector(selectMapImageFeature, (state: MapImageState) => state.images);
export const selectLinkedMapImages = createSelector(selectMapImageFeature, (state: MapImageState) => state.linkedMapImages);
export const selectDeletedMapImages = createSelector(selectMapImageFeature, (state:MapImageState) =>
  state.mapImages?.filter((mapImage => mapImage.isDeleted))
)
