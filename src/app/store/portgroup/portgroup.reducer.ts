import { createReducer, on } from '@ngrx/store';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';
import { retrievedPortGroups } from './portgroup.actions';

const initialState = {} as PortGroupState;

export const portGroupReducer = createReducer(
  initialState,
  on(retrievedPortGroups, (state, { data }) => ({
    ...state,
    portgroups: data,
  })),
);