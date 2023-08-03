import { createAction, props } from '@ngrx/store';

export const retrievedMap = createAction(
  'retrievedMap',
  props<{ data: any }>()
);

export const retrievedIsMapOpen = createAction(
  'retrievedIsMapOpen',
  props<{ data: any }>()
);

export const loadMap = createAction(
  'loadMap',
  props<{
    projectId: string,
    mapCategory: string
  }>()
);

export const loadLinkedMap = createAction(
  'loadLinkedMap',
  props<{
    projectId: string,
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
  props<{ data: any }>()
);

export const mapLoadedDefaultPreferencesSuccess = createAction(
  'mapLoadedDefaultPreferencesSuccess',
  props<{ data: any }>()
);

export const reloadGroupBoxes = createAction(
  'reloadGroupBoxes',
);

export const removeNodesOnMap = createAction(
  'removeNodesOnMap',
  props<{ ids: number[] }>()
);
