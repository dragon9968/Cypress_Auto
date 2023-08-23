import { createReducer, on } from '@ngrx/store';
import { MapState } from 'src/app/store/map/map.state';
import { retrievedMap, retrievedIsMapOpen, mapLoadedSuccess, mapDestroySuccess } from './map.actions';

const initialState = {} as MapState;

export const mapReducer = createReducer(
  initialState,
  on(retrievedMap, (state, { data }) => ({
    ...state,
    defaultPreferences: data.default_preferences.map_style,
    nodes: data.nodes,
    portgroups: data.portgroups,
    interfaces: data.interfaces,
    groups: data.groups
  })),
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
