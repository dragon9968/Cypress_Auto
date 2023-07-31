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