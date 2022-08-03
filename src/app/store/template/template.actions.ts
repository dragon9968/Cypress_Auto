import { createAction, props } from '@ngrx/store';

export const retrievedTemplates = createAction(
  'retrievedTemplates',
  props<{ data: any }>()
);