import { createReducer, on } from '@ngrx/store';
import { ProjectState } from 'src/app/store/project/project.state';
import {
  retrievedVMStatus,
  retrievedProjects,
  retrievedCurrentProject,
  retrievedIsOpen,
  retrievedDashboard,
  retrievedProjectName,
  retrievedRecentProjects,
  retrievedProjectsTemplate,
  retrievedAllProjects,
  retrievedProjectCategory,
  projectLoadedSuccess, projectsNotLinkYetLoadedSuccess, removeProjectNotLink
} from './project.actions';

const initialState = {} as ProjectState;

export const projectReducer = createReducer(
  initialState,
  on(retrievedProjects, (state, { data }) => ({
    ...state,
    projects: data,
  })),
  on(retrievedCurrentProject, (state, { data }) => ({
    ...state,
    currentProject: data,
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
  })),
  on(retrievedProjectCategory, (state, { projectCategory }) => ({
    ...state,
    projectCategory: projectCategory
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
  })
);
