import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { ProjectState } from 'src/app/store/project/project.state';

export const selectProjectFeature = createFeatureSelector<ProjectState>(ReducerKeys.PROJECT);
export const selectVMStatus = createSelector(selectProjectFeature, (state: ProjectState) => state.vmStatus);
export const selectDashboard = createSelector(selectProjectFeature, (state: ProjectState) => state.dashboard);
export const selectRecentProjects = createSelector(selectProjectFeature, (state: ProjectState) => state.recentProjects);
export const selectProjectsNotLinkYet = createSelector(selectProjectFeature, (state: ProjectState) => state.projectsNotLinkYet)

export const selectAllProjects = createSelector(selectProjectFeature, (state: ProjectState) => state.projects);
export const selectDefaultPreferences = createSelector(selectProjectFeature, (state: ProjectState) => state.defaultPreferences);
export const selectProject = createSelector(selectAllProjects, (selectAllProjects) => selectAllProjects?.filter(p => p.isOpen)[0]);
export const selectProjectName = createSelector(selectProject, (selectProject) => selectProject?.name);
export const selectProjectCategory = createSelector(selectProject, (selectProject) => selectProject?.category);
export const selectActiveProjects = createSelector(selectAllProjects, (selectAllProjects) => selectAllProjects?.filter(p => p.status == 'active' && p.category == 'project'));
export const selectActiveTemplates = createSelector(selectAllProjects, (selectAllProjects) => selectAllProjects?.filter(p => p.status == 'active' && p.category == 'template'));
export const selectDeletedProjects = createSelector(selectAllProjects, (selectAllProjects) => selectAllProjects?.filter(p => p.status == 'delete'));
export const selectActiveProjectsTemplates = createSelector(selectActiveProjects, selectActiveTemplates, (selectActiveProjects, selectActiveTemplates) => selectActiveProjects?.concat(selectActiveTemplates));
