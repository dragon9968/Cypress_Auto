import { createAction, props } from '@ngrx/store';

export const retrievedLookupFeatures = createAction(
  'retrievedLookupFeatures',
  props<{ data: any }>()
);