import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapState } from 'src/app/store/map/map.state';

export const selectMapFeature = createFeatureSelector<MapState>(ReducerKeys.MAP);
export const selectDefaultPreferences = createSelector(selectMapFeature, (state: MapState) => state.defaultPreferences);
export const selectIsMapOpen = createSelector(selectMapFeature, (state: MapState) => state.isMapOpen);
