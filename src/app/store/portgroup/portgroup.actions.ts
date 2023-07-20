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

export const selectPG = createAction(
  'selectPG',
  props<{ id: string }>()
);

export const unSelectPG = createAction(
  'unSelectPG',
  props<{ id: string }>()
);
