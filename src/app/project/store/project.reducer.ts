import { createReducer, on } from '@ngrx/store';
import { retrievedProject, retrievedProjects } from './project.actions';
import { ProjectModel } from '../models/project.model';

export const initialState: ProjectModel = {
  list: [],
  current: {}
};

export const projectReducer = createReducer(
  initialState,
  on(retrievedProjects, (state, { data }) => ({ ...state, list: data.result })),
  on(retrievedProject, (state, { data }) => ({ ...state, current: data.result }))
);