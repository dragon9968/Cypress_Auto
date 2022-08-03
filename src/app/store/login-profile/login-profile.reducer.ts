import { createReducer, on } from '@ngrx/store';
import { LoginProfileState } from 'src/app/store/login-profile/login-profile.state';
import { retrievedLoginProfiles } from './login-profile.actions';

const initialState = {} as LoginProfileState;

export const loginProfileReducer = createReducer(
  initialState,
  on(retrievedLoginProfiles, (state, { data }) => ({
    ...state,
    loginProfiles: data,
  })),
);