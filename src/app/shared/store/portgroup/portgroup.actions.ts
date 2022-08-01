import { createAction, props } from '@ngrx/store';

export const retrievedPortGroups = createAction(
  'retrievedPortGroups',
  props<{ data: any }>()
);