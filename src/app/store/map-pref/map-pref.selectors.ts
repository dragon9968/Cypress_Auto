import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapPrefState } from 'src/app/store/map-pref/map-pref.state';

export const selectMapPrefFeature = createFeatureSelector<MapPrefState>(ReducerKeys.MAP_PREF);
export const selectMapPref = createSelector(selectMapPrefFeature, (state: MapPrefState) => state.mapPref);
