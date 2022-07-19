import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { TemplateModel } from '../../models/template.model';

export const selectTemplateFeature = createFeatureSelector<TemplateModel>(ReducerKeys.TEMPLATE);
export const selectTemplates = createSelector(selectTemplateFeature, (state: TemplateModel) => state.templates);

