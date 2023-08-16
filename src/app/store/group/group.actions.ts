import { createAction, props } from "@ngrx/store";

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

export const selectAllGroup = createAction(
  'selectAllGroup'
);

export const unSelectAllGroup = createAction(
  'unSelectAllGroup'
);

export const updateGroup = createAction(
  'updateGroup',
  props<{
    id: number,
    data: any,
  }>()
);

export const addNodePgToGroup = createAction(
  'addNodePgToGroup',
  props<{
    id: number,
    data: any,
    projectId: any
  }>()
);

export const updateSelectedNodeInGroup = createAction(
  'updateSelectedNodeInGroup',
  props<{
    id: number,
  }>()
)

export const addNodePgToGroupSuccess = createAction(
  'addNodePgToGroupSuccess',
  props<{ groupsData: any }>()
)

export const groupUpdatedSuccess = createAction(
  'groupUpdatedSuccess',
  props<{ group: any }>()
);

export const updateNodeInGroup = createAction(
  'updateNodeInGroup',
  props<{ node: any }>()
);

export const updatePGInGroup = createAction(
  'updatePGInGroup',
  props<{ portGroup: any }>()
);

export const updateMapImageInGroup = createAction(
  'updateMapImageInGroup',
  props<{ mapImage: any }>()
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

export const removeNodesInGroup = createAction(
  'removeNodesInGroup',
  props<{ ids: number[] }>()
);

export const restoreNodesInGroup = createAction(
  'restoreNodesInGroup',
  props<{ ids: number[] }>()
);

export const removePGsInGroup = createAction(
  'removePGsInGroup',
  props<{ ids: number[] }>()
);

export const restorePGsInGroup = createAction(
  'restorePGsInGroup',
  props<{ ids: number[] }>()
);


export const groupDeletedSuccess = createAction(
  'groupDeletedSuccess',
  props<{
    id: number,
  }>()
);

export const deleteGroups = createAction(
  'deleteGroups',
  props<{
    ids: number[],
  }>()
);

export const groupsDeletedSuccess = createAction(
  'groupsDeletedSuccess',
  props<{
    ids: number[],
  }>()
);
