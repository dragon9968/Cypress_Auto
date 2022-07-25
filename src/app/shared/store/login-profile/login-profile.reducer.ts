import { createReducer, on } from '@ngrx/store';
import { LoginProfileModel } from '../../models/login-profile.model';
import { retrievedLoginProfiles } from './login-profile.actions';

const initialState = {} as LoginProfileModel;

export const loginProfileReducer = createReducer(
  initialState,
  on(retrievedLoginProfiles, (state, { data }) => ({
    ...state,
    loginProfiles: data,
  })),
);