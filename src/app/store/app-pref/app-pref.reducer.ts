import { createReducer, on } from '@ngrx/store';
import { retrievedAppPref } from './app-pref.actions';
import { AppPrefState } from './app-pref.state';

const initialState = {} as AppPrefState;

export const appPrefReducer = createReducer(
  initialState,
  on(retrievedAppPref, (state, { data }) => ({
    ...state,
    appPref: data,
  })),
);