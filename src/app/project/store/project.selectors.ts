import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { ProjectModel } from '../models/project.model';
 
export const selectProject = createFeatureSelector<ProjectModel>(ReducerKeys.PROJECT);

export const selectProjects = createSelector(selectProject, (state: ProjectModel) => state.list);
