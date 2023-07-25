import { createAction, props } from '@ngrx/store';

export const retrievedAppPref = createAction(
  'retrievedAppPref',
  props<{ data: any }>()
);

export const loadAppPref = createAction(
  'loadAppPref'
);

export const appPrefLoadedSuccess = createAction(
  'appPrefLoadedSuccess',
  props<{ appPref: any }>()
);