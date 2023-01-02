import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { ConfigTemplateState } from './config-template.state';

export const selectConfigTemplateFeature = createFeatureSelector<ConfigTemplateState>(ReducerKeys.CONFIG_TEMPLATE);
export const selectConfigTemplates = createSelector(selectConfigTemplateFeature, (state: ConfigTemplateState) => state.configTemplates);

