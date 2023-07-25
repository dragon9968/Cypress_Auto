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
