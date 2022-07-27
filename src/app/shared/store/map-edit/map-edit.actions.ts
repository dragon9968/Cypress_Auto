import { createAction, props } from '@ngrx/store';

export const retrievedNodeAdd = createAction(
  'retrievedNodeAdd',
  props<{ data: any }>()
);