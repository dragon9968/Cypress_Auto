import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { MapCategoryState } from './map.category.state';
export const selectMapCategoryFeature = createFeatureSelector<MapCategoryState>(ReducerKeys.MAP_CATEGORY);
export const selectMapCategory = createSelector(selectMapCategoryFeature, (state: MapCategoryState) => state.mapCategory);