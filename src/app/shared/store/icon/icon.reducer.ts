import { createReducer, on } from '@ngrx/store';
import { DeviceModel } from '../../models/device.model';
import { retrievedIcons } from './icon.actions';

const initialState = {} as DeviceModel;

export const iconReducer = createReducer(
  initialState,
  on(retrievedIcons, (state, { data }) => ({
    ...state,
    icons: data.result,
  })),
);