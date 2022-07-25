import { createReducer, on } from '@ngrx/store';
import { MapPrefModel } from '../../models/map-pref.model';
import { retrievedMapPref } from './map-pref.actions';

const initialState = {} as MapPrefModel;

export const mapPrefReducer = createReducer(
  initialState,
  on(retrievedMapPref, (state, { data }) => ({
    ...state,
    mapPref: data,
  })),
);