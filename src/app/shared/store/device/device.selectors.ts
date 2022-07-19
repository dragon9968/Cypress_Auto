import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/shared/enums/reducer-keys.enum';
import { DeviceModel } from '../../models/device.model';

export const selectDeviceFeature = createFeatureSelector<DeviceModel>(ReducerKeys.DEVICE);
export const selectDevices = createSelector(selectDeviceFeature, (state: DeviceModel) => state.devices);

