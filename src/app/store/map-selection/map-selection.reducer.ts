import { createReducer, on } from '@ngrx/store';
import { retrievedMapSelection } from './map-selection.actions';

const initialState = {} as any;

export const mapSelectionReducer = createReducer(
  initialState,
  on(retrievedMapSelection, (state, { data }) => ({
    ...state,
    mapSelection: data,
  })),
);