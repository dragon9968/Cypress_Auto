import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { AppPrefState } from './app-pref.state';


export const selectAppPrefFeature = createFeatureSelector<AppPrefState>(ReducerKeys.APP_PREF);
export const selectAppPref = createSelector(selectAppPrefFeature, (state: AppPrefState) => state.appPref);
