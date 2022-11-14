import { createAction, props } from '@ngrx/store';

export const retrievedMapImages = createAction(
  'retrievedMapImages',
  props<{ data: any }>()
);