import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { LoginProfileState } from 'src/app/store/login-profile/login-profile.state';

export const selectLoginProfileFeature = createFeatureSelector<LoginProfileState>(ReducerKeys.LOGIN_PROFILE);
export const selectLoginProfiles = createSelector(selectLoginProfileFeature, (state: LoginProfileState) => state.loginProfiles);

