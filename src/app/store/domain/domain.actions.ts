import { createAction, props } from '@ngrx/store';

export const retrievedDomains = createAction(
  'retrievedDomains',
  props<{ data: any }>()
);