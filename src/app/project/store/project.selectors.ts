import { createFeatureSelector } from '@ngrx/store';
import { ProjectModel } from '../models/project.model';
 
export const selectProject = createFeatureSelector<ProjectModel>('project');