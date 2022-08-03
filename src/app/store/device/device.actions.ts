import { createAction, props } from '@ngrx/store';

export const retrievedDevices = createAction(
  'retrievedDevices',
  props<{ data: any }>()
);