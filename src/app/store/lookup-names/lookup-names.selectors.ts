import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { LookupNamesState } from './lookup-names.state';


export const selectLookupNamesFeature = createFeatureSelector<LookupNamesState>(ReducerKeys.LOOKUP_NAMES);
export const selectLookupNames = createSelector(selectLookupNamesFeature, (state: LookupNamesState) => state.lookupNames);
