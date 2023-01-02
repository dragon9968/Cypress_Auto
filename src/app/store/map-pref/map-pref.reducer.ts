import { createReducer, on } from '@ngrx/store';
import { retrievedMapPrefs } from './map-pref.actions';
import { MapPrefState } from './map-pref.state';

const initialState = {} as MapPrefState;

export const mapPrefReducer = createReducer(
  initialState,
  on(retrievedMapPrefs, (state, { data }) => ({
    ...state,
    mapPrefs: data,
  })),
);