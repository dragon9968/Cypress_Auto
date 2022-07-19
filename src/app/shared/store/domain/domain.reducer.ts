import { createReducer, on } from '@ngrx/store';
import { DomainModel } from '../../models/domain.model';
import { retrievedDomains } from './domain.actions';

const initialState = {} as DomainModel;

export const domainReducer = createReducer(
  initialState,
  on(retrievedDomains, (state, { data }) => ({
    ...state,
    domains: data.result,
  })),
);