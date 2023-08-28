import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapState } from 'src/app/store/map/map.state';

export const selectMapFeature = createFeatureSelector<MapState>(ReducerKeys.MAP);
export const selectIsMapOpen = createSelector(selectMapFeature, (state: MapState) => state.isMapOpen);
export const selectIsMapLoadedSuccess = createSelector(selectMapFeature, (state: MapState) => state.isLoaded);
