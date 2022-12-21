import { createReducer, on } from '@ngrx/store';
import { PortGroupState } from 'src/app/store/portgroup/portgroup.state';
import { retrievedPortGroups, retrievedPortGroupsManagement } from './portgroup.actions';

const initialState = {} as PortGroupState;

export const portGroupReducer = createReducer(
  initialState,
  on(retrievedPortGroups, (state, { data }) => ({
    ...state,
    portgroups: data,
  })),
  on(retrievedPortGroupsManagement, (state, { data }) => ({
    ...state,
    portGroupsManagement: data,
  })),
);
