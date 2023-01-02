import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapPrefState } from './map-pref.state';


export const selectMapPrefFeature = createFeatureSelector<MapPrefState>(ReducerKeys.MAP_PREFS);
export const selectMapPrefs = createSelector(selectMapPrefFeature, (state: MapPrefState) => state.mapPrefs);
