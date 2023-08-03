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

export const selectAllPG = createAction(
  'selectAllPG'
);

export const unselectAllPG = createAction(
  'unselectAllPG'
);

export const removePGs = createAction(
  'removePGs',
  props<{ ids: number[] }>()
);

export const removePGsSuccess = createAction(
  'removePGsSuccess',
  props<{ ids: number[] }>()
);

export const restorePGs = createAction(
  'restorePGs',
  props<{ ids: number[] }>()
);

export const restorePGsSuccess = createAction(
  'restorePGsSuccess',
  props<{ ids: number[] }>()
);

export const updatePG = createAction(
  'updatePG',
  props<{
    id: number,
    data: any,
  }>()
);

export const pgUpdatedSuccess = createAction(
  'pgUpdatedSuccess',
  props<{ portgroup: any }>()
);

export const updateDomainInPG = createAction(
  'updateDomainInPG',
  props<{ domain: any }>()
);

export const bulkEditPG = createAction(
  'bulkEditPG',
  props<{
    ids: any,
    data: any,
  }>()
);

export const bulkUpdatedPGSuccess = createAction(
  'bulkUpdatedPGSuccess',
  props<{ portgroups: any }>()
)

export const linkedMapPGsLoadedSuccess = createAction(
  'linkedMapPGsLoadedSuccess',
  props<{ portgroups: any, mapLinkId: number, position: any }>()
);

export const clearLinkedMapPGs = createAction(
  'clearLinkedMapPGs'
)
