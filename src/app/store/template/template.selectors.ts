import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { TemplateState } from 'src/app/store/template/template.state';

export const selectTemplateFeature = createFeatureSelector<TemplateState>(ReducerKeys.TEMPLATE);
export const selectTemplates = createSelector(selectTemplateFeature, (state: TemplateState) => state.templates);

