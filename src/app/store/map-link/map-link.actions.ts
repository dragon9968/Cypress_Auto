import { createAction, props } from "@ngrx/store";


export const loadMapLinks = createAction(
  'loadMapLinks',
  props<{ projectId: number }>()
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

export const selectAllMapLink = createAction(
  'selectAllMapLink'
);

export const unSelectAllMapLink = createAction(
  'unSelectAllMapLink'
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

export const removeMapLinks = createAction(
  'removeMapLinks',
  props<{ ids: number[] }>()
);

export const removeMapLinksSuccess = createAction(
  'removeMapLinksSuccess',
  props<{ ids: number[] }>()
);

export const restoreMapLinks = createAction(
  'restoreMapLinks',
  props<{ ids: number[] }>()
);

export const restoreMapLinksSuccess = createAction(
  'restoreMapLinksSuccess',
  props<{ ids: number[] }>()
);

export const addLinkedElementsToMap = createAction(
  'addLinkedElementsToMap',
);

export const clearMapLinks = createAction(
  'clearMapLinks'
)
