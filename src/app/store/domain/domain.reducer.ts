import { createReducer, on } from '@ngrx/store';
import { DomainState } from 'src/app/store/domain/domain.state';
import { domainAddedSuccess, domainUpdatedSuccess, domainsLoadedSuccess, retrievedDomains } from './domain.actions';

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
  on(domainUpdatedSuccess, (state, { domain }) => {
    const domains = state.domains.map((d: any) => (d.id == domain.id) ? { ...d, ...domain } : d);
    return {
      ...state,
      domains,
    };
  }),
  on(domainAddedSuccess, (state, { domain }) => {
    const domains = [ ...state.domains, domain ];
    return {
      ...state,
      domains,
    };
  }),
);