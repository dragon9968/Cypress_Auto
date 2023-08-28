import { createAction, props } from '@ngrx/store';

export const retrievedTemplates = createAction(
  'retrievedTemplates',
  props<{ data: any }>()
);

export const retrievedTemplatesByDevice = createAction(
  'retrievedTemplatesByDevice',
  props<{ templatesByDevice: any }>()
);