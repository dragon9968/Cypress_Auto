import { createReducer, on } from '@ngrx/store';
import { retrievedMapEdit } from './map-edit.actions';

const initialState = {} as any;

export const mapEditReducer = createReducer(
  initialState,
  on(retrievedMapEdit, (state, { data }) => ({
    ...state,
    mapEdit: data,
  })),
);