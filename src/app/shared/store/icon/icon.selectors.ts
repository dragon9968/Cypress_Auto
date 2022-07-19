import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { IconModel } from '../../models/icon.model';

export const selectIconFeature = createFeatureSelector<IconModel>(ReducerKeys.ICON);
export const selectIcons = createSelector(selectIconFeature, (state: IconModel) => state.icons);

