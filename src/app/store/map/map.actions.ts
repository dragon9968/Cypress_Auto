import { createAction, props } from '@ngrx/store';

export const retrievedMap = createAction(
  'retrievedMap',
  props<{ data: any }>()
);