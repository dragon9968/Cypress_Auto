import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DomainUserState } from "./domain-user.state";
import { ReducerKeys } from "../reducer-keys.enum";

export const selectDomainUserFeature = createFeatureSelector<DomainUserState>(ReducerKeys.DOMAIN_USER);
export const selectDomainUsers = createSelector(selectDomainUserFeature, (state: DomainUserState) => state.domainUsers)
