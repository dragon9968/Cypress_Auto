import { createAction, props } from '@ngrx/store';

export const retrievedMap = createAction(
  'retrievedMapData',
  props<{ data: any }>()
);