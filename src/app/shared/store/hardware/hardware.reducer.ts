import { createReducer, on } from '@ngrx/store';
import { HardwareModel } from '../../models/hardware.model';
import { retrievedHardwares } from './hardware.actions';

const initialState = {} as HardwareModel;

export const hardwareReducer = createReducer(
  initialState,
  on(retrievedHardwares, (state, { data }) => ({
    ...state,
    hardwares: data.result,
  })),
);