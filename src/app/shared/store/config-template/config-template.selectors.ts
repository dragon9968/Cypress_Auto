import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { ConfigTemplateModel } from '../../models/config-template.model';

export const selectConfigTemplateFeature = createFeatureSelector<ConfigTemplateModel>(ReducerKeys.CONFIG_TEMPLATE);
export const selectConfigTemplates = createSelector(selectConfigTemplateFeature, (state: ConfigTemplateModel) => state.configTemplates);

