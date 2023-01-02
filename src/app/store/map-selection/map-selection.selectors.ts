import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapSelectionFeature = createFeatureSelector<any>(ReducerKeys.MAP_SELECTION);
export const selectMapSelection = createSelector(selectMapSelectionFeature, (state: any) => state.mapSelection);

