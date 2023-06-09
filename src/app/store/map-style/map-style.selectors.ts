import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapStyleFeature = createFeatureSelector<any>(ReducerKeys.MAP_STYLE);
export const selectMapPref = createSelector(selectMapStyleFeature, (state: any) => state.mapPref);
