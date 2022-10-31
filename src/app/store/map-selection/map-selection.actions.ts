import { createAction, props } from '@ngrx/store';

export const retrievedMapSelection = createAction(
  'retrievedMapSelection',
  props<{ data: any }>()
);