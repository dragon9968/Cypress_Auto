import { createReducer, on } from '@ngrx/store';
import { retrievedNetmasks } from './netmask.actions';
import { NetmaskState } from './netmask.state';

const initialState = {} as NetmaskState;

export const netmaskReducer = createReducer(
  initialState,
  on(retrievedNetmasks, (state, { data }) => ({
    ...state,
    netmasks: data,
  })),
);
