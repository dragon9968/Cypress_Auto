import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import { retrievedVMStatus, retrievedProjects } from './project.actions';

const initialState = {} as ProjectState;

export const projectReducer = createReducer(
  initialState,
  on(retrievedProjects, (state, { data }) => ({
    ...state,
    projects: data,
  })),
  on(retrievedVMStatus, (state, { vmStatus }) => ({
    ...state,
    vmStatus: vmStatus,
  }))
);
