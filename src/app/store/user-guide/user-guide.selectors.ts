import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { UserGuideState } from './user-guide.state';


export const selectUserGuideFeature = createFeatureSelector<UserGuideState>(ReducerKeys.USER_GUIDE);
export const selectUserGuide = createSelector(selectUserGuideFeature, (state: UserGuideState) => state.isDisabled);
