import { createReducer, on } from "@ngrx/store";
import { DomainUserChangeState } from "./domain-user-change.state";
import { retrievedIsChangeDomainUsers } from "./domain-user-change.actions";

const initialState = {} as DomainUserChangeState;

export const isChangeDomainUserReducer = createReducer(
  initialState,
  on(retrievedIsChangeDomainUsers, (state, { isChangeDomainUsers }) => ({
    ...state,
    isChangeDomainUsers: isChangeDomainUsers
  }))
)
