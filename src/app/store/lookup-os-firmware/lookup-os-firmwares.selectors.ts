import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { LookupOsFirmwaresState } from './lookup-os-firmwares.state';

export const selectLookOSFirmwareFeaturesFeature = createFeatureSelector<LookupOsFirmwaresState>(ReducerKeys.LOOKUP_OS_FIRMWARE);
export const selectLookupOSFirmwares = createSelector(selectLookOSFirmwareFeaturesFeature, (state: LookupOsFirmwaresState) => state.lookupOSFirmwares);

