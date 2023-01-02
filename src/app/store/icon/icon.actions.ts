import { createAction, props } from '@ngrx/store';

export const retrievedIcons = createAction(
  'retrievedIcons',
  props<{ data: any }>()
);