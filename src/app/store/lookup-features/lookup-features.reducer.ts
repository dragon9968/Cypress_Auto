import { createReducer, on } from '@ngrx/store';
import { retrievedLookupFeatures } from './lookup-features.actions';
import { LookupFeaturesState } from './lookup-features.state';

const initialState = {} as LookupFeaturesState;

export const lookupFeaturesReducer = createReducer(
  initialState,
  on(retrievedLookupFeatures, (state, { data }) => ({
    ...state,
    lookupFeatures: data,
  })),
);