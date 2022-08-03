import { createReducer, on } from '@ngrx/store';
import { ConfigTemplateState } from 'src/app/store/config-template/config-template.state';
import { retrievedConfigTemplates } from './config-template.actions';

const initialState = {} as ConfigTemplateState;

export const configTemplateReducer = createReducer(
  initialState,
  on(retrievedConfigTemplates, (state, { data }) => ({
    ...state,
    configTemplates: data,
  })),
);