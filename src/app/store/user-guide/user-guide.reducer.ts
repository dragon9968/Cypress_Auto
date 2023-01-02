import { createReducer, on } from '@ngrx/store';
import { retrievedUserGuide } from './user-guide.actions';
import { UserGuideState } from './user-guide.state';

const initialState = {} as UserGuideState;

export const userGuideReducer = createReducer(
  initialState,
  on(retrievedUserGuide, (state, { data }) => ({
    ...state,
    isDisabled: data,
  })),
);