import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { LookupFeaturesState } from './lookup-features.state';

export const selectLookupFeaturesFeature = createFeatureSelector<LookupFeaturesState>(ReducerKeys.LOOKUP_FEATURES);
export const selectLookupFeatures = createSelector(selectLookupFeaturesFeature, (state: LookupFeaturesState) => state.lookupFeatures);

