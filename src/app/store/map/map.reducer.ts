import { createReducer, on } from '@ngrx/store';
import { MapState } from 'src/app/store/map/map.state';
import { retrievedIsMapOpen, mapLoadedSuccess, mapDestroySuccess } from './map.actions';

const initialState = {} as MapState;

export const mapReducer = createReducer(
  initialState,
  on(retrievedIsMapOpen, (state, { data }) => ({
    ...state,
    isMapOpen: data,
  })),
  on(mapLoadedSuccess, (state, { }) => ({
    ...state,
    isLoaded: true,
  })),
  on(mapDestroySuccess, (state, { }) => ({
    ...state,
    isLoaded: false,
  })),
);
