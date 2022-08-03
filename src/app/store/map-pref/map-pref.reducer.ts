import { createReducer, on } from '@ngrx/store';
import { MapPrefState } from 'src/app/store/map-pref/map-pref.state';
import { retrievedMapPref } from './map-pref.actions';

const initialState = {} as MapPrefState;

export const mapPrefReducer = createReducer(
  initialState,
  on(retrievedMapPref, (state, { data }) => ({
    ...state,
    mapPref: data,
  })),
);