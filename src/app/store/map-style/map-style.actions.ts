import { createAction, props } from '@ngrx/store';

export const retrievedMapPref = createAction(
  'retrievedMapPref',
  props<{ data: any }>()
);