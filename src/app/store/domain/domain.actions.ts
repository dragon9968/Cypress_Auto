import { createAction, props } from '@ngrx/store';

export const loadDomains = createAction(
  'loadDomains',
  props<{ projectId: number }>()
);

export const domainsLoadedSuccess = createAction(
  'domainsLoadedSuccess',
  props<{ domains: any }>()
);

export const updateDomain = createAction(
  'updateDomain',
  props<{
    id: number,
    data: any,
  }>()
);

export const domainUpdatedSuccess = createAction(
  'domainUpdatedSuccess',
  props<{ domain: any }>()
);

export const addDomain = createAction(
  'addDomain',
  props<{
    data: any,
  }>()
);

export const domainAddedSuccess = createAction(
  'domainAddedSuccess',
  props<{ domain: any }>()
);

export const deleteDomains = createAction(
  'deleteDomains',
  props<{
    ids: number[],
    projectId: number,
  }>()
);

export const domainsDeletedSuccess = createAction(
  'domainsDeletedSuccess',
  props<{
    ids: number[],
  }>()
);