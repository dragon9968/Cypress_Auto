import { createAction, props } from '@ngrx/store';
import { OSFirmwareModel } from "../../core/models/os-firmware.model";

export const loadedLookupOSFirmwareSuccess = createAction(
  'loadedLookupOSFirmwareSuccess',
  props<{ osFirmwares: OSFirmwareModel[] }>()
);

export const loadLookupOSFirmwares = createAction(
  'loadLookupOSFirmwares'
);

export const addNewOSFirmware = createAction(
  'addNewOSFirmware',
  props<{ newOSFirmware: OSFirmwareModel }>()
);

export const addedNewOSFirmwareSuccess = createAction(
  'addedNewOSFirmwareSuccess',
  props<{ newOSFirmware: OSFirmwareModel }>()
);

export const updateOSFirmware = createAction(
  'updateOSFirmware',
  props<{ osFirmware: OSFirmwareModel }>()
);

export const updateOSFirmwareSuccess = createAction(
  'updateOSFirmwareSuccess',
  props<{ osFirmware: OSFirmwareModel }>()
);

export const deleteOSFirmwares = createAction(
  'deleteOSFirmware',
  props<{ pks: number[] }>()
);

export const exportOSFirmwares = createAction(
  'exportOSFirmwares',
  props<{ pks: number[] }>()
);

export const importOSFirmware = createAction(
  'importOSFirmware',
  props<{ importData: FormData }>()
);

