import { LocalStorageKeys } from "./local-storage-keys.enum";

export type LocalStorageData = {
  [LocalStorageKeys.ACCESS_TOKEN]: string;
  [LocalStorageKeys.REFRESH_TOKEN]: string;
  [LocalStorageKeys.CONNECTIONS]: string;
  [LocalStorageKeys.PROJECT_ID]: string;
  [LocalStorageKeys.USER_ID]: string;
  [LocalStorageKeys.PERMISSIONS]: any[];
  [LocalStorageKeys.ROLES]: any[];
  [LocalStorageKeys.INFO_PANEL_HEIGHT]: string;
  [LocalStorageKeys.MAP_STATE]: string;
};
