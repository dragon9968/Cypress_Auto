import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { MapPrefModel } from '../../models/map-pref.model';

export const selectMapPrefFeature = createFeatureSelector<MapPrefModel>(ReducerKeys.MAP_PREF);
export const selectMapPref = createSelector(selectMapPrefFeature, (state: MapPrefModel) => state.mapPref);
