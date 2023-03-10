import { createAction, props } from '@ngrx/store';

export const retrievedLookupNames = createAction(
  'retrievedLookupNames',
  props<{ data: any }>()
);