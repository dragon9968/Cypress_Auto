import { createAction, props } from '@ngrx/store';

export const retrievedHistories = createAction(
  'retrievedHistories',
  props<{ data: any }>()
);
