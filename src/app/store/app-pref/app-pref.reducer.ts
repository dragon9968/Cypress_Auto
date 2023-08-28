import { createReducer, on } from '@ngrx/store';
import { appPrefLoadedSuccess } from './app-pref.actions';
import { AppPrefState } from './app-pref.state';

const initialState = {} as AppPrefState;

export const appPrefReducer = createReducer(
  initialState,
  on(appPrefLoadedSuccess, (state, { appPref }) => {
    return {
      ...state,
      appPref: appPref,
    }
  }),
);
