import { createReducer, on } from '@ngrx/store';
import { TemplateModel } from '../../models/template.model';
import { retrievedTemplates } from './template.actions';

const initialState = {} as TemplateModel;

export const templateReducer = createReducer(
  initialState,
  on(retrievedTemplates, (state, { data }) => ({
    ...state,
    templates: data,
  })),
);