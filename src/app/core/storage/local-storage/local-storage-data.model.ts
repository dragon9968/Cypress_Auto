import { LocalStorageKeys } from "./local-storage-keys.enum";

export type LocalStorageData = {
  [LocalStorageKeys.ACCESS_TOKEN]: string;
  [LocalStorageKeys.REFRESH_TOKEN]: string;
  [LocalStorageKeys.CONNECTIONS]: string;
  [LocalStorageKeys.COLLECTION_ID]: string;
  [LocalStorageKeys.USER_ID]: string;
};
