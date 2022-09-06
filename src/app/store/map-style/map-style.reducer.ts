import { createReducer, on } from '@ngrx/store';
import { retrievedMapPref } from './map-style.actions';

const initialState = {} as any;

export const mapStyleReducer = createReducer(
  initialState,
  on(retrievedMapPref, (state, { data }) => ({
    ...state,
    mapStyle: data,
  })),
);