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

export const mapLoadedSuccess = createAction(
  'mapLoadedSuccess',
  props<{ data: any }>()
);

export const reloadGroupBoxes = createAction(
  'reloadGroupBoxes',
);
