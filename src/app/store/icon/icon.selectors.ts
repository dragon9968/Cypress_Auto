import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { IconState } from 'src/app/store/icon/icon.state';

export const selectIconFeature = createFeatureSelector<IconState>(ReducerKeys.ICON);
export const selectIcons = createSelector(selectIconFeature, (state: IconState) => state.icons);

