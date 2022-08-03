import { createAction, props } from '@ngrx/store';

export const retrievedHardwares = createAction(
  'retrievedHardwares',
  props<{ data: any }>()
);