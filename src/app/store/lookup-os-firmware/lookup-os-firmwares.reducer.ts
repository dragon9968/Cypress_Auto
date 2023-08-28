import { createReducer, on } from '@ngrx/store';
import { LookupOsFirmwaresState } from './lookup-os-firmwares.state';
import {
  addedNewOSFirmwareSuccess,
  loadedLookupOSFirmwareSuccess, updateOSFirmwareSuccess
} from "./lookup-os-firmwares.actions";
import { OSFirmwareModel } from "../../core/models/os-firmware.model";

const initialState = {} as LookupOsFirmwaresState;

export const lookupOsFirmwaresReducer = createReducer(
  initialState,
  on(loadedLookupOSFirmwareSuccess, (state, { osFirmwares }) => ({
    ...state,
    lookupOSFirmwares: osFirmwares,
  })),
  on(addedNewOSFirmwareSuccess, (state, { newOSFirmware }) => {
    return {
      ...state,
      lookupOSFirmwares: state.lookupOSFirmwares.concat(newOSFirmware)
    }
  }),
  on(updateOSFirmwareSuccess, (state, { osFirmware }) => {
    const osFirmwares = JSON.parse(JSON.stringify(state.lookupOSFirmwares))
    const index = osFirmwares.findIndex((item: OSFirmwareModel) => item.id === osFirmware.id)
    osFirmwares.splice(index, 1, osFirmware)
    return {
      ...state,
      lookupOSFirmwares: osFirmwares
    }
  }),
);
