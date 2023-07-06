import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';

export const selectMapFilterOptionFeature = createFeatureSelector<any>(ReducerKeys.FILTER_OPTION);
export const selectMapFilterOptionNodes = createSelector(selectMapFilterOptionFeature, (state: any) => state.mapFilterOptionNodes);
export const selectMapFilterOptionPG = createSelector(selectMapFilterOptionFeature, (state: any) => state.mapFilterOptionPG);
export const selectMapFilterOptionInterfaces = createSelector(selectMapFilterOptionFeature, (state: any) => state.mapFilterOptionInterfaces);
export const selectMapFilterOptionGroup = createSelector(selectMapFilterOptionFeature, (state: any) => state.mapFilterOptionGroup);
