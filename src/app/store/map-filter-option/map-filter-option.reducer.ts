import { createReducer, on } from '@ngrx/store';
import { retrievedMapFilterOptionGroup, retrievedMapFilterOptionInterfaces, retrievedMapFilterOptionNodes, retrievedMapFilterOptionPG } from './map-filter-option.actions';

const initialState = {} as any;

export const mapFilterOptionReducer = createReducer(
  initialState,
  on(retrievedMapFilterOptionNodes, (state, { data }) => ({
    ...state,
    mapFilterOptionNodes: data,
  })),
  on(retrievedMapFilterOptionPG, (state, { data }) => ({
    ...state,
    mapFilterOptionPG: data,
  })),
  on(retrievedMapFilterOptionInterfaces, (state, { data }) => ({
    ...state,
    mapFilterOptionInterfaces: data,
  })),
  on(retrievedMapFilterOptionGroup, (state, { data }) => ({
    ...state,
    mapFilterOptionGroup: data,
  })),
);