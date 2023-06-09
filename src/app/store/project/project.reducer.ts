import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import {
  retrievedVMStatus,
  retrievedProjects,
  retrievedIsOpen,
  retrievedDashboard,
  retrievedProjectName,
  retrievedRecentProjects,
  retrievedProjectsTemplate,
  retrievedAllProjects
} from './project.actions';

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
  })),
  on(retrievedIsOpen, (state, { data }) => ({
    ...state,
    isOpen: data,
  })),
  on(retrievedDashboard, (state, { dashboard }) => ({
    ...state,
    dashboard: dashboard
  })),
  on(retrievedProjectName, (state, { projectName }) => ({
    ...state,
    projectName: projectName
  })),
  on(retrievedRecentProjects, (state, { recentProjects }) => ({
    ...state,
    recentProjects: recentProjects
  })),
  on(retrievedProjectsTemplate, (state, { template }) => ({
    ...state,
    template: template
  })),
  on(retrievedAllProjects, (state, { listAllProject }) => ({
    ...state,
    listAllProject: listAllProject
  }))
);
