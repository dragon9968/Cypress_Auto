import { createAction, props } from '@ngrx/store';

export const retrievedVMStatus = createAction(
  'retrievedVMStatus',
  props<{ vmStatus: any }>()
);

export const retrievedDashboard = createAction(
  'retrievedDashboard',
  props<{ dashboard: any }>()
);

export const loadRecentProjects = createAction(
  'loadRecentProjects',
);

export const recentProjectsLoadedSuccess = createAction(
  'recentProjectsLoadedSuccess',
  props<{ recentProjects: any[] }>()
);

export const openProject = createAction(
  'openProject',
  props<{ id: number }>()
);

export const loadProjectsNotLinkYet = createAction(
  'loadProjectsNotLinkYet',
  props<{ projectId: number }>()
)

export const projectsNotLinkYetLoadedSuccess = createAction(
  'projectsNotLinkYetLoadedSuccess',
  props<{ projectsNotLinkYet: any[] }>()
)

export const removeProjectNotLink = createAction(
  'removeProjectNotLink',
  props<{ projectNotLinkId: number }>()
)

export const validateProject = createAction(
  'validateProject',
  props<{ id: number }>()
)

export const loadProjects = createAction(
  'loadProjects',
);

export const projectsLoadedSuccess = createAction(
  'projectsLoadedSuccess',
  props<{ projects: any[] }>()
);

export const sharedProjectsLoadedSuccess = createAction(
  'sharedProjectsLoadedSuccess',
  props<{ sharedProjects: any[] }>()
);

export const closeProject = createAction(
  'closeProject',
);

export const updateProject = createAction(
  'updateProject',
  props<{
    id: number,
    data: any,
    configData: any
  }>()
);

export const projectUpdatedSuccess = createAction(
  'projectUpdatedSuccess',
  props<{ project: any }>()
);

export const recentProjectUpdatedSuccess = createAction(
  'recentProjectUpdatedSuccess',
  props<{ recentProject: any }>()
);

export const defaultPreferencesLoadedSuccess = createAction(
  'defaultPreferencesLoadedSuccess',
  props<{ defaultPreferences: any }>()
);

export const removeProjects = createAction(
  'removeProjects',
  props<{ ids: number[] }>()
)