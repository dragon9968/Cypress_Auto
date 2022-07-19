import { createReducer, on } from '@ngrx/store';
import { ProjectModel } from '../../models/project.model';
import { retrievedProjects } from './project.actions';

const initialState = {} as ProjectModel;

export const projectReducer = createReducer(
  initialState,
  on(retrievedProjects, (state, { data }) => ({
    ...state,
    projects: data.result
  }))
);