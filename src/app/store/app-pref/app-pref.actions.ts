import { createAction, props } from '@ngrx/store';

export const retrievedAppPref = createAction(
  'retrievedAppPref',
  props<{ data: any }>()
);