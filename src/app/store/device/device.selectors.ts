import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ReducerKeys } from 'src/app/store/reducer-keys.enum';
import { DeviceState } from 'src/app/store/device/device.state';

export const selectDeviceFeature = createFeatureSelector<DeviceState>(ReducerKeys.DEVICE);
export const selectDevices = createSelector(selectDeviceFeature, (state: DeviceState) => state.devices);

