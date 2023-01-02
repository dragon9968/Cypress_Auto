import { createAction, props } from '@ngrx/store';

export const retrievedMapEdit = createAction(
  'retrievedMapEdit',
  props<{ data: any }>()
);