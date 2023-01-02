import { createAction, props } from "@ngrx/store";

export const retrievedDomainUsers = createAction(
  'retrievedDomainUsers',
  props<{ data: any }>()
);
