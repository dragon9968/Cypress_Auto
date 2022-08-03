import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapOptionFeature = createFeatureSelector<any>(ReducerKeys.MAP_OPTION);
export const selectMapOption = createSelector(selectMapOptionFeature, (state: any) => state.mapOption);

