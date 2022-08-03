import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapEditFeature = createFeatureSelector<any>(ReducerKeys.MAP_EDIT);
export const selectMapEdit = createSelector(selectMapEditFeature, (state: any) => state.mapEdit);

