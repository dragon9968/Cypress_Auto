import { createReducer, on } from '@ngrx/store';
import { DeviceModel } from '../../models/device.model';
import { retrievedDevices } from './device.actions';

const initialState = {} as DeviceModel;

export const deviceReducer = createReducer(
  initialState,
  on(retrievedDevices, (state, { data }) => ({
    ...state,
    devices: data.result,
  })),
);