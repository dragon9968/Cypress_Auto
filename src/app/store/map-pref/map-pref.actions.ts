import { createAction, props } from '@ngrx/store';

export const retrievedMapPrefs = createAction(
  'retrievedMapPrefs',
  props<{ data: any }>()
);