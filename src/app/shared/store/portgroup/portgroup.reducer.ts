import { createReducer, on } from '@ngrx/store';
import { PortGroupModel } from '../../models/portgroup.model';
import { retrievedPortGroups } from './portgroup.actions';

const initialState = {} as PortGroupModel;

export const portGroupReducer = createReducer(
  initialState,
  on(retrievedPortGroups, (state, { data }) => ({
    ...state,
    portgroups: data,
  })),
);