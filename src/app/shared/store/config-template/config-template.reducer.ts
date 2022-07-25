import { createReducer, on } from '@ngrx/store';
import { ConfigTemplateModel } from '../../models/config-template.model';
import { retrievedConfigTemplates } from './config-template.actions';

const initialState = {} as ConfigTemplateModel;

export const configTemplateReducer = createReducer(
  initialState,
  on(retrievedConfigTemplates, (state, { data }) => ({
    ...state,
    configTemplates: data,
  })),
);