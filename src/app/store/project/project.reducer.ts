import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import {
  retrievedVMStatus,
  retrievedDashboard,
  retrievedRecentProjects,
  projectsNotLinkYetLoadedSuccess,
  removeProjectNotLink,
  projectsLoadedSuccess,
  closeProject,
  projectUpdatedSuccess,
  openProject,
  defaultPreferencesLoadedSuccess,
  sharedProjectsLoadedSuccess
} from './project.actions';

const initialState = {} as ProjectState;

export const projectReducer = createReducer(
  initialState,
  on(retrievedVMStatus, (state, { vmStatus }) => ({
    ...state,
    vmStatus: vmStatus,
  })),
  on(retrievedDashboard, (state, { dashboard }) => ({
    ...state,
    dashboard: dashboard
  })),
  on(retrievedRecentProjects, (state, { recentProjects }) => ({
    ...state,
    recentProjects: recentProjects
  })),
  on(openProject, (state, { id }) => {
    let defaultPreferences = state.defaultPreferences;
    return {
      ...state,
      projects: state.projects?.map(p => {
        if (p.id == id) {
          defaultPreferences = p.logical_map.map_style;
          return { ...p, isOpen: true };
        } else {
          return { ...p, isOpen: false };
        }
      }),
      defaultPreferences
    };
  }),
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
  on(projectsLoadedSuccess, (state, { projects }) => ({
    ...state,
    projects
  })),
  on(sharedProjectsLoadedSuccess, (state, { sharedProjects }) => ({
    ...state,
    sharedProjects
  })),
  on(closeProject, (state, { }) => ({
    ...state,
    projects: state.projects.map(p => p.isOpen ? { ...p, isOpen: false } : p)
  })),
  on(projectUpdatedSuccess, (state, { project }) => {
    return {
      ...state,
      projects: state.projects.map(p => p.id == project.id ? { ...p, ...project } : p)
    };
  }),
  on(defaultPreferencesLoadedSuccess, (state, { defaultPreferences }) => {
    return {
      ...state,
      defaultPreferences
    };
  }),
);
