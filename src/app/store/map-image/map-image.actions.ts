import { createAction, props } from '@ngrx/store';

export const retrievedMapImages = createAction(
  'retrievedMapImages',
  props<{ mapImage: any }>()
);

export const retrievedImages = createAction(
  'retrievedImages',
  props<{ data: any }>()
);

export const loadMapImages = createAction(
  'loadMapImages',
  props<{ projectId: string }>()
);

export const mapImagesLoadedSuccess = createAction(
  'mapImagesLoadedSuccess',
  props<{ mapImages: any }>()
);

export const selectMapImage = createAction(
  'selectMapImage',
  props<{ id: string }>()
);

export const unSelectMapImage = createAction(
  'unSelectMapImage',
  props<{ id: string }>()
);

export const selectAllMapImage = createAction(
  'selectAllMapImage'
);

export const unSelectAllMapImage = createAction(
  'unSelectAllMapImage'
);

export const linkedMapImagesLoadedSuccess = createAction(
  'linkedMapImagesLoadedSuccess',
  props<{ mapImages: any, mapLinkId: number, position: any }>()
);

export const clearLinkedMapImages = createAction(
  'clearLinkedMapImages'
)
