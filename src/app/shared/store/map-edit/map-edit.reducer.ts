import { createReducer, on } from '@ngrx/store';
import { retrievedNodeAdd } from './map-edit.actions';

const initialState = {} as any;

export const mapEditReducer = createReducer(
  initialState,
  on(retrievedNodeAdd, (state, { data }) => ({
    ...state,
    mapEdit: data,
  })),
);