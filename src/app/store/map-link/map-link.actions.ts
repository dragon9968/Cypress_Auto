import { createAction, props } from "@ngrx/store";


export const loadMapLinks = createAction(
  'loadMapLinks',
  props<{ projectId: string }>()
);

export const mapLinksLoadedSuccess = createAction(
  'mapLinksLoadedSuccess',
  props<{ mapLinks: any[] }>()
);

export const selectMapLink = createAction(
  'selectMapLink',
  props<{ id: string }>()
);

export const unSelectMapLink = createAction(
  'unSelectMapLink',
  props<{ id: string }>()
);

export const addNewMapLink = createAction(
  'addNewMapLink',
  props<{ mapLink: any }>()
);

export const mapLinkAddedSuccess = createAction(
  'mapLinkAddedSuccess',
  props<{ mapLink: any }>()
);

export const addNewMapLinkToMap = createAction(
  'addNewMapLinkToMap',
  props<{ id: number }>()
);

export const updateMapLink = createAction(
  'updateMapLink',
  props<{
    id: number,
    data: any
  }>()
);

export const mapLinkUpdatedSuccess = createAction(
  'mapLinkUpdatedSuccess',
  props<{ mapLink: any }>()
);

export const removeMapLink = createAction(
  'removeMapLink',
  props<{ id: string }>()
);

export const addLinkedElementsToMap = createAction(
  'addLinkedElementsToMap',
);

export const clearMapLinks = createAction(
  'clearMapLinks'
)
