import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { DomainModel } from '../../models/domain.model';

export const selectDomainFeature = createFeatureSelector<DomainModel>(ReducerKeys.DOMAIN);
export const selectDomains = createSelector(selectDomainFeature, (state: DomainModel) => state.domains);

