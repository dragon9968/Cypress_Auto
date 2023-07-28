import { createAction, props } from "@ngrx/store";

export const retrievedNodes = createAction(
  'retrievedNodes',
  props<{ data: any }>()
)

export const retrievedNameNodeBySourceNode = createAction(
  'retrievedNameNodeBySourceNode',
  props<{ nameNode: any }>()
);

export const loadNodes = createAction(
  'loadNodes',
  props<{ projectId: string }>()
);

export const nodesLoadedSuccess = createAction(
  'nodesLoadedSuccess',
  props<{ nodes: any }>()
);

export const selectNode = createAction(
  'selectNode',
  props<{ id: string }>()
);

export const unSelectNode = createAction(
  'unSelectNode',
  props<{ id: string }>()
);

export const removeNode = createAction(
  'removeNode',
  props<{ id: string }>()
);

export const updateNode = createAction(
  'updateNode',
  props<{
    id: number,
    data: any,
    configTemplate: any,
    configDefaultNode: any
  }>()
);

export const nodeUpdatedSuccess = createAction(
  'nodeUpdatedSuccess',
  props<{ node: any }>()
);

export const bulkUpdatedNodeSuccess = createAction(
  'bulkUpdatedNodeSuccess',
  props<{ nodes: any }>()
);

export const updateInterfaceInNode = createAction(
  'updateInterfaceInNode',
  props<{ interfaceData: any }>()
);

export const addNewNode = createAction(
  'addNewNode',
  props<{ node: any }>()
);

export const nodeAddedSuccess = createAction(
  'nodeAddedSuccess',
  props<{ node: any }>()
);

export const bulkEditNode = createAction(
  'bulkEditNode',
  props<{
    ids: any,
    data: any,
    configTemplate: any
  }>()
);

export const addNewNodeToMap = createAction(
  'addNewNodeToMap',
  props<{ id: number }>()
);

