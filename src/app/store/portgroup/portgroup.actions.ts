import { createAction, props } from '@ngrx/store';

export const retrievedPortGroups = createAction(
  'retrievedPortGroups',
  props<{ data: any }>()
);

export const retrievedPortGroupsManagement = createAction(
  'retrievedPortGroupsManagement',
  props<{ data: any }>()
);
