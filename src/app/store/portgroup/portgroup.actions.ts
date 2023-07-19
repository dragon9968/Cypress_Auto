import { createAction, props } from '@ngrx/store';

export const retrievedPortGroups = createAction(
  'retrievedPortGroups',
  props<{ data: any }>()
);

export const loadPGs = createAction(
  'loadPGs',
  props<{ projectId: string }>()
);

export const PGsLoadedSuccess = createAction(
  'PGsLoadedSuccess',
  props<{ portgroups: any }>()
);
