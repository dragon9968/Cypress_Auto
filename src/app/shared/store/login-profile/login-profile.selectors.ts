import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { LoginProfileModel } from '../../models/login-profile.model';

export const selectLoginProfileFeature = createFeatureSelector<LoginProfileModel>(ReducerKeys.LOGIN_PROFILE);
export const selectLoginProfiles = createSelector(selectLoginProfileFeature, (state: LoginProfileModel) => state.loginProfiles);

