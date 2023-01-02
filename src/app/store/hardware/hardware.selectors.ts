import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { HardwareState } from 'src/app/store/hardware/hardware.state';

export const selectHardwareFeature = createFeatureSelector<HardwareState>(ReducerKeys.HARDWARE);
export const selectHardwares = createSelector(selectHardwareFeature, (state: HardwareState) => state.hardwares);

