import { createAction, props } from "@ngrx/store";

export const retrievedGroups = createAction(
  'retrievedGroups',
  props<{data: any}>()
);

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
