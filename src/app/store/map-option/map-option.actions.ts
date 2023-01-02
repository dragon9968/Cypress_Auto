import { createAction, props } from '@ngrx/store';

export const retrievedMapOption = createAction(
  'retrievedMapOption',
  props<{ data: any }>()
);

export const retrievedSearchText = createAction(
  'retrievedSearchText',
  props<{ data: any }>()
);