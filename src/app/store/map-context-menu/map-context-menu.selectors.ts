import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapContextMenuFeature = createFeatureSelector<any>(ReducerKeys.MAP_CM);
export const selectMapContextMenu = createSelector(selectMapContextMenuFeature, (state: any) => state.mapContextMenu);

