import { LocalStorageKeys } from "./local-storage-keys.enum";

export type LocalStorageData = {
  [LocalStorageKeys.ACCESS_TOKEN]: string;
  [LocalStorageKeys.REFRESH_TOKEN]: string;
};