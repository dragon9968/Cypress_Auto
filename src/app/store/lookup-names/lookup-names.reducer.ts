import { createReducer, on } from '@ngrx/store';
import { retrievedLookupNames } from './lookup-names.actions';
import { LookupNamesState } from './lookup-names.state';

const initialState = {} as LookupNamesState;

export const LookupNamesReducer = createReducer(
  initialState,
  on(retrievedLookupNames, (state, { data }) => ({
    ...state,
    lookupNames: data,
  })),
);