import { createAction, props } from '@ngrx/store';

export const retrievedProjects = createAction(
    'retrievedProjects',
    props<{ data: any }>()
);

export const retrievedCurrentProject = createAction(
    'retrievedCurrentProject',
    props<{ data: any }>()
);

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

export const retrievedProjectName = createAction(
  'retrievedProjectName',
  props<{ projectName: any }>()
);

export const retrievedRecentProjects = createAction(
  'retrievedRecentProjects',
  props<{ recentProjects: any }>()
);

export const retrievedProjectsTemplate = createAction(
  'retrievedProjectsTemplate',
  props<{ template: any }>()
);

export const retrievedAllProjects = createAction(
  'retrievedAllProjects',
  props<{ listAllProject: any }>()
);

export const retrievedProjectCategory = createAction(
  'retrievedProjectCategory',
  props<{ projectCategory: string }>()
);

export const loadProject = createAction(
  'loadProject',
  props<{ projectId: string }>()
);

export const projectLoadedSuccess = createAction(
  'projectLoadedSuccess',
  props<{ project: any }>()
);

