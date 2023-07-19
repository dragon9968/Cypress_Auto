import { createAction, props } from '@ngrx/store';

export const retrievedDomains = createAction(
  'retrievedDomains',
  props<{ data: any }>()
);

export const loadDomains = createAction(
  'loadDomains',
  props<{ projectId: string }>()
);

export const domainsLoadedSuccess = createAction(
  'domainsLoadedSuccess',
  props<{ domains: any }>()
);