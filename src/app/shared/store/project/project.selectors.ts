import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { ProjectModel } from '../../models/project.model';
 
export const selectProjectFeature = createFeatureSelector<ProjectModel>(ReducerKeys.PROJECT);
export const selectProjects = createSelector(selectProjectFeature, (state: ProjectModel) => state.projects);
