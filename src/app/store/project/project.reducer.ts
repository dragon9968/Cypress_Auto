import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import {
  retrievedVMStatus,
  retrievedIsOpen,
  retrievedDashboard,
  retrievedRecentProjects,
  projectLoadedSuccess, projectsNotLinkYetLoadedSuccess, removeProjectNotLink, projectsLoadedSuccess, closeProject
} from './project.actions';

const initialState = {} as ProjectState;

export const projectReducer = createReducer(
  initialState,
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
  on(retrievedRecentProjects, (state, { recentProjects }) => ({
    ...state,
    recentProjects: recentProjects
  })),
  on(projectLoadedSuccess, (state, { project }) => ({
    ...state,
    project
  })),
  on(projectsNotLinkYetLoadedSuccess, (state, { projectsNotLinkYet }) => ({
    ...state,
    projectsNotLinkYet
  })),
  on(removeProjectNotLink, (state, { projectNotLinkId }) => {
    const projectsNotLinkYet = state.projectsNotLinkYet.filter(project => project.id !== projectNotLinkId)
    return {
      ...state,
      projectsNotLinkYet
    }
  }),
  on(projectsLoadedSuccess, (state, { allProjects }) => ({
    ...state,
    allProjects
  })),
  on(closeProject, (state, { }) => ({
    ...state,
    project: undefined
  })),
);
