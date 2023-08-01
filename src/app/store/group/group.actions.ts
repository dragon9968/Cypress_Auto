import { createAction, props } from "@ngrx/store";

export const retrievedGroups = createAction(
  'retrievedGroups',
  props<{data: any}>()
);

export const loadGroups = createAction(
  'loadGroups',
  props<{ projectId: string }>()
);

export const groupsLoadedSuccess = createAction(
  'groupsLoadedSuccess',
  props<{ groups: any }>()
);
export const selectGroup = createAction(
  'selectGroup',
  props<{ id: string }>()
);

export const unSelectGroup = createAction(
  'unSelectGroup',
  props<{ id: string }>()
);

export const updateGroup = createAction(
  'updateGroup',
  props<{
    id: number,
    data: any,
  }>()
);

export const groupUpdatedSuccess = createAction(
  'groupUpdatedSuccess',
  props<{ group: any }>()
);

export const updateNodeInGroup = createAction(
  'updateNodeInGroup',
  props<{ node: any }>()
);

export const addGroup = createAction(
  'addGroup',
  props<{
    data: any,
  }>()
);

export const groupAddedSuccess = createAction(
  'groupAddedSuccess',
  props<{ group: any }>()
);