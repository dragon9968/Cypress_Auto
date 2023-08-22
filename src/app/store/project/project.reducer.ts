import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import {
  retrievedVMStatus,
  retrievedIsOpen,
  retrievedDashboard,
  retrievedRecentProjects,
  projectsNotLinkYetLoadedSuccess,
  removeProjectNotLink,
  projectsLoadedSuccess,
  closeProject,
  projectUpdatedSuccess,
  openProject
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
  on(openProject, (state, { id }) => ({
    ...state,
    projects: state.projects?.map(p => p.id == id ? { ...p, isOpen: true } : p)
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
  on(projectsLoadedSuccess, (state, { projects }) => ({
    ...state,
    projects
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
);
