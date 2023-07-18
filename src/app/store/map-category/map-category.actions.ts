import { createAction, props } from '@ngrx/store';

export const retrievedMapCategory = createAction(
  'retrievedMapCategory',
  props<{ mapCategory: any }>()
);