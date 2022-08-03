import { createReducer, on } from '@ngrx/store';
import { HardwareState } from 'src/app/store/hardware/hardware.state';
import { retrievedHardwares } from './hardware.actions';

const initialState = {} as HardwareState;

export const hardwareReducer = createReducer(
  initialState,
  on(retrievedHardwares, (state, { data }) => ({
    ...state,
    hardwares: data,
  })),
);