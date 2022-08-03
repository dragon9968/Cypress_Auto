import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { DomainState } from 'src/app/store/domain/domain.state';

export const selectDomainFeature = createFeatureSelector<DomainState>(ReducerKeys.DOMAIN);
export const selectDomains = createSelector(selectDomainFeature, (state: DomainState) => state.domains);

