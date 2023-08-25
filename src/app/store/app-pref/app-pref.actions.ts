import { createAction, props } from '@ngrx/store';

export const loadAppPref = createAction(
  'loadAppPref'
);

export const appPrefLoadedSuccess = createAction(
  'appPrefLoadedSuccess',
  props<{ appPref: any }>()
);