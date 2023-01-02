import { createAction, props } from "@ngrx/store";

export const retrievedIsChangeDomainUsers = createAction(
  'retrievedIsChangeDomainUsers',
  props<{ isChangeDomainUsers: any }>()
);
