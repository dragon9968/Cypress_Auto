import { createAction, props } from '@ngrx/store';

export const retrievedVMStatus = createAction(
  'retrievedVMStatus',
  props<{ vmStatus: any }>()
);

export const retrievedIsOpen = createAction(
  'retrievedIsOpen',
  props<{ data: any }>()
);

export const retrievedDashboard = createAction(
  'retrievedDashboard',
  props<{ dashboard: any }>()
);

export const retrievedRecentProjects = createAction(
  'retrievedRecentProjects',
  props<{ recentProjects: any }>()
);

export const loadProject = createAction(
  'loadProject',
  props<{ projectId: number }>()
);

export const projectLoadedSuccess = createAction(
  'projectLoadedSuccess',
  props<{ project: any }>()
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
  props<{ projectId: number }>()
)

export const loadProjects = createAction(
  'loadProjects',
);

export const projectsLoadedSuccess = createAction(
  'projectsLoadedSuccess',
  props<{ allProjects: any }>()
);

export const closeProject = createAction(
  'closeProject',
);
