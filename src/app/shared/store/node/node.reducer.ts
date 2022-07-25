import { createReducer, on } from '@ngrx/store';
import { NodeModel } from '../../models/node.model';
import { retrievedNodeAdd } from './node.actions';

const initialState = {} as NodeModel;

export const nodeReducer = createReducer(
  initialState,
  on(retrievedNodeAdd, (state, { data }) => ({
    ...state,
    nodeAdd: data,
  })),
);