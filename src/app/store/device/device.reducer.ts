import { createReducer, on } from '@ngrx/store';
import { DeviceState } from 'src/app/store/device/device.state';
import { retrievedDevices } from './device.actions';

const initialState = {} as DeviceState;

export const deviceReducer = createReducer(
  initialState,
  on(retrievedDevices, (state, { data }) => ({
    ...state,
    devices: data,
  })),
);