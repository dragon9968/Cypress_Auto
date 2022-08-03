import { createAction, props } from '@ngrx/store';

export const retrievedConfigTemplates = createAction(
  'retrievedConfigTemplates',
  props<{ data: any }>()
);