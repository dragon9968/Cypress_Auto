import { createAction, props } from '@ngrx/store';

export const retrievedMapContextMenu = createAction(
  'retrievedMapContextMenu',
  props<{ data: any }>()
);