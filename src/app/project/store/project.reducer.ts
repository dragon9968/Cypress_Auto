import { createReducer, on } from '@ngrx/store';
import { retrievedProjects } from './project.actions';
import { ProjectModel } from '../models/project.model';

const initialState: ProjectModel = {
  list: []
};

export const projectReducer = createReducer(
  initialState,
  on(retrievedProjects, (state, { data }) => ({
    ...state,
    list: data.result
  }))
);