import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { ProjectState } from 'src/app/store/project/project.state';

export const selectProjectFeature = createFeatureSelector<ProjectState>(ReducerKeys.PROJECT);
export const selectProjects = createSelector(selectProjectFeature, (state: ProjectState) => state.projects);
export const selectCurrentProject = createSelector(selectProjectFeature, (state: ProjectState) => state.currentProject);
export const selectVMStatus = createSelector(selectProjectFeature, (state: ProjectState) => state.vmStatus);
export const selectIsOpen = createSelector(selectProjectFeature, (state: ProjectState) => state.isOpen);
export const selectDashboard = createSelector(selectProjectFeature, (state: ProjectState) => state.dashboard);
export const selectProjectName = createSelector(selectProjectFeature, (state: ProjectState) => state.projectName);
export const selectRecentProjects = createSelector(selectProjectFeature, (state: ProjectState) => state.recentProjects);
export const selectProjectTemplate = createSelector(selectProjectFeature, (state: ProjectState) => state.template);
export const selectAllProjects = createSelector(selectProjectFeature, (state: ProjectState) => state.listAllProject);
export const selectProjectCategory = createSelector(selectProjectFeature, (state: ProjectState) => state.projectCategory)
export const selectProject = createSelector(selectProjectFeature, (state: ProjectState) => state.project)
export const selectProjectsNotLinkYet = createSelector(selectProjectFeature, (state: ProjectState) => state.projectsNotLinkYet)
