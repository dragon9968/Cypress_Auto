import { createAction, props } from '@ngrx/store';

export const retrievedUserGuide = createAction(
  'retrievedUserGuide',
  props<{ data: any }>()
);