import { createReducer, on } from '@ngrx/store';
import { retrievedMapOption, retrievedSearchText } from './map-option.actions';

const initialState = {} as any;

export const mapOptionReducer = createReducer(
  initialState,
  on(retrievedMapOption, (state, { data }) => ({
    ...state,
    mapOption: data,
  })),
  on(retrievedSearchText, (state, { data }) => ({
    ...state,
    searchText: data,
  })),
);