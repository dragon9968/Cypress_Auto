import { createAction, props } from '@ngrx/store';

export const retrievedMapFilterOptionNodes = createAction(
  'retrievedMapFilterOptionNodes',
  props<{ data: any }>()
);

export const retrievedMapFilterOptionPG = createAction(
  'retrievedMapFilterOptionPG',
  props<{ data: any }>()
);

export const retrievedMapFilterOptionInterfaces = createAction(
  'retrievedMapFilterOptionInterfaces',
  props<{ data: any }>()
);

export const retrievedMapFilterOptionGroup = createAction(
  'retrievedMapFilterOptionGroup',
  props<{ data: any }>()
);
