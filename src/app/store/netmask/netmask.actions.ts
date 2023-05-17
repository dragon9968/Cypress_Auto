import { createAction, props } from '@ngrx/store';

export const retrievedNetmasks = createAction(
  'retrievedNetmasks',
  props<{ data: any }>()
);
