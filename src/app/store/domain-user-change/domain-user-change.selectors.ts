import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ReducerKeys } from "../reducer-keys.enum";
import { DomainUserChangeState } from "./domain-user-change.state";

export const selectIsChangeDomainUserFeature = createFeatureSelector<DomainUserChangeState>(ReducerKeys.DOMAIN_USER_CHANGE);
export const selectIsChangeDomainUsers = createSelector(selectIsChangeDomainUserFeature, (state: DomainUserChangeState) => state.isChangeDomainUsers);
