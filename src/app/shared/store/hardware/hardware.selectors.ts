import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { HardwareModel } from '../../models/hardware.model';

export const selectHardwareFeature = createFeatureSelector<HardwareModel>(ReducerKeys.HARDWARE);
export const selectHardwares = createSelector(selectHardwareFeature, (state: HardwareModel) => state.hardwares);

