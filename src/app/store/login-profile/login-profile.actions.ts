import { createAction, props } from '@ngrx/store';

export const retrievedLoginProfiles = createAction(
  'retrievedLoginProfiles',
  props<{ data: any }>()
);