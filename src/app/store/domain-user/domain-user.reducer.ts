import { DomainUserState } from "./domain-user.state";
import { createReducer, on } from "@ngrx/store";
import { retrievedDomainUsers } from "./domain-user.actions";

const initialState = {} as DomainUserState;

export const domainUserReducer = createReducer(
  initialState,
  on(retrievedDomainUsers, (state, { data }) => ({
      ...state,
      domainUsers: data
    })
))
