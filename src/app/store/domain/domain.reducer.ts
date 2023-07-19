import { createReducer, on } from '@ngrx/store';
import { DomainState } from 'src/app/store/domain/domain.state';
import { domainsLoadedSuccess, retrievedDomains } from './domain.actions';

const initialState = {} as DomainState;

export const domainReducer = createReducer(
  initialState,
  on(retrievedDomains, (state, { data }) => ({
    ...state,
    domains: data,
  })),
  on(domainsLoadedSuccess, (state, { domains }) => ({
    ...state,
    domains,
  })),
);