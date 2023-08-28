import { createAction, props } from '@ngrx/store';

export const retrievedIsMapOpen = createAction(
  'retrievedIsMapOpen',
  props<{ data: any }>()
);

export const loadMap = createAction(
  'loadMap',
  props<{
    projectId: number,
    mapCategory: string
  }>()
);

export const addTemplateIntoProject = createAction(
  'addTemplateIntoProject',
  props<{ data: any, newPosition: { x: number, y: number }, mapCategory: any }>()
)

export const addTemplateItemsToMap = createAction(
  'addTemplateItemsToMap',
  props<{ newItemIds: any, newPosition: { x: number, y: number } }>()
);

export const loadLinkedMap = createAction(
  'loadLinkedMap',
  props<{
    projectId: number,
    mapCategory: string,
    mapLinkId: number,
    position: any
  }>()
);

export const clearLinkedMap = createAction(
  'clearLinkedMap'
)

export const mapLoadedSuccess = createAction(
  'mapLoadedSuccess',
);

export const mapDestroySuccess = createAction(
  'mapDestroySuccess',
);

export const reloadGroupBoxes = createAction(
  'reloadGroupBoxes',
);

export const removeNodesOnMap = createAction(
  'removeNodesOnMap',
  props<{ ids: number[] }>()
);

export const selectAllElementsOnMap = createAction(
  'selectAllElementsOnMap'
)

export const unSelectAllElementsOnMap = createAction(
  'unSelectAllElementsOnMap'
)
